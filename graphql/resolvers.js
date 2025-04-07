const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const Progress = require('../models/Progress');
const Razorpay = require('razorpay');
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure Razorpay - only initialize if credentials are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} else {
  console.log('Razorpay credentials not found. Payment features will be disabled.');
}

// Configure Cloudinary - only initialize if credentials are available
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} else {
  console.log('Cloudinary credentials not found. Image upload features will be disabled.');
}

// Create email transporter - only initialize if credentials are available
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
} else {
  console.log('Email credentials not found. Email features will be disabled.');
}

const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    user: async (_, { id }) => {
      return await User.findById(id);
    },
    courses: async () => {
      try {
        return await Course.find()
          .populate('teacher')
          .populate('students');
      } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
    },
    course: async (_, { id }) => {
      try {
        return await Course.findById(id)
          .populate('teacher')
          .populate('students')
          .populate('lectures');
      } catch (error) {
        console.error('Error fetching course:', error);
        throw error;
      }
    },
    lectures: async (_, { courseId }) => {
      return await Lecture.find({ course: courseId });
    },
    progress: async (_, { userId, courseId }) => {
      return await Progress.findOne({ student: userId, course: courseId })
        .populate('completedLectures');
    },
    me: async (_, __, { user }) => {
      try {
        console.log('Me query - User context:', user);
        
        if (!user) {
          console.log('No user in context');
          throw new Error('Not authenticated');
        }

        const currentUser = await User.findById(user.userId)
          .populate('courses')
          .select('-password');
        
        if (!currentUser) {
          console.log('User not found in database');
          throw new Error('User not found');
        }

        console.log('Me query - Found user:', currentUser.email);
        return currentUser;
      } catch (error) {
        console.error('Me query error:', error);
        throw error;
      }
    }
  },

  Mutation: {
    register: async (_, { input }) => {
      try {
        const { email, password, name, role } = input;
        
        // Validate input
        if (!email || !password || !name || !role) {
          throw new Error('All fields are required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('Invalid email format');
        }

        // Validate password length
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        // Validate role
        if (!['student', 'teacher'].includes(role)) {
          throw new Error('Invalid role');
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          throw new Error('User already exists');
        }

        // Create new user
        const user = new User({
          email: email.toLowerCase(),
          password,
          name,
          role,
          isEmailVerified: true,
          status: 'active'
        });

        await user.save();

        // Check if JWT_SECRET is available
        if (!process.env.JWT_SECRET) {
          throw new Error('Authentication service is not properly configured. Please contact support.');
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        return {
          token,
          user
        };
      } catch (error) {
        console.error('Registration error:', error);
        throw new Error(error.message || 'Registration failed');
      }
    },
    login: async (_, { email, password }) => {
      try {
        console.log('Login attempt for:', email);
        
        // Input validation
        if (!email || !password) {
          console.log('Missing email or password');
          throw new Error('Email and password are required');
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
          console.log('User not found:', email);
          throw new Error('Invalid email or password');
        }

        // Check password
        try {
          const isValid = await user.comparePassword(password);
          console.log('Password valid:', isValid);
          
          if (!isValid) {
            console.log('Invalid password for user:', email);
            throw new Error('Invalid email or password');
          }
        } catch (error) {
          console.error('Password comparison error:', error);
          throw new Error('Invalid email or password');
        }

        // Check account status
        if (user.status !== 'active') {
          console.log('User account not active:', email);
          throw new Error('Account is not active');
        }

        // Check if JWT_SECRET is available
        if (!process.env.JWT_SECRET) {
          throw new Error('Authentication service is not properly configured. Please contact support.');
        }

        // Generate token
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        console.log('Login successful for:', email);

        // Return user data without sensitive information
        return {
          token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            profileCompleted: user.profileCompleted,
            status: user.status
          }
        };
      } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Login failed');
      }
    },
    verifyEmail: async (_, { token }) => {
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired verification token');
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      return {
        success: true,
        message: 'Email verified successfully'
      };
    },
    requestPasswordReset: async (_, { email }) => {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = user.generatePasswordResetToken();
      await user.save();

      // Check if FRONTEND_URL is available
      if (!process.env.FRONTEND_URL) {
        console.log('FRONTEND_URL not configured. Using default URL.');
      }

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
      
      // Check if email service is configured
      if (transporter) {
        await transporter.sendMail({
          to: user.email,
          subject: 'Reset your EduVerse password',
          html: `
            <h1>Password Reset Request</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
          `
        });
      } else {
        console.log(`Password reset requested for ${user.email}. Reset URL: ${resetUrl}`);
        // In a production environment, you might want to log this to a file or database
      }

      return {
        success: true,
        message: 'Password reset email sent'
      };
    },
    resetPassword: async (_, { token, newPassword }) => {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return {
        success: true,
        message: 'Password reset successfully'
      };
    },
    updateProfile: async (_, { input }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const user = await User.findById(context.user.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update profile fields
      if (input.bio) user.profile.bio = input.bio;
      if (input.avatar) user.profile.avatar = input.avatar;
      if (input.phone) user.profile.phone = input.phone;
      if (input.address) user.profile.address = input.address;
      
      // Update education
      if (input.education) {
        user.profile.education = input.education.map(edu => ({
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : null
        }));
      }

      // Update experience
      if (input.experience) {
        user.profile.experience = input.experience.map(exp => ({
          company: exp.company,
          position: exp.position,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          description: exp.description
        }));
      }

      user.profileCompleted = true;
      await user.save();

      return user;
    },
    createCourse: async (_, { input }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }

        if (user.role !== 'teacher') {
          throw new Error('Only teachers can create courses');
        }

        const course = new Course({
          ...input,
          teacher: user.userId,
        });

        await course.save();
        return course;
      } catch (error) {
        console.error('Error creating course:', error);
        throw error;
      }
    },
    addLecture: async (_, { courseId, title, videoUrl, pdfUrl }, { user }) => {
      const course = await Course.findById(courseId);
      if (!course || course.teacher.toString() !== user._id.toString()) {
        throw new Error('Unauthorized');
      }

      // If videoUrl is a file upload, upload to Cloudinary
      if (videoUrl && videoUrl.startsWith('data:')) {
        const result = await cloudinary.uploader.upload(videoUrl, {
          resource_type: 'video',
          folder: 'eduverse/videos'
        });
        videoUrl = result.secure_url;
      }

      // If pdfUrl is a file upload, upload to Cloudinary
      if (pdfUrl && pdfUrl.startsWith('data:')) {
        const result = await cloudinary.uploader.upload(pdfUrl, {
          resource_type: 'raw',
          folder: 'eduverse/pdfs'
        });
        pdfUrl = result.secure_url;
      }

      const lecture = new Lecture({
        title,
        videoUrl,
        pdfUrl,
        course: courseId
      });
      await lecture.save();

      course.lectures.push(lecture._id);
      await course.save();

      return lecture;
    },
    updateProgress: async (_, { lectureId }, { user }) => {
      const lecture = await Lecture.findById(lectureId);
      if (!lecture) {
        throw new Error('Lecture not found');
      }

      let progress = await Progress.findOne({
        student: user._id,
        course: lecture.course
      });

      if (!progress) {
        progress = new Progress({
          student: user._id,
          course: lecture.course,
          completedLectures: []
        });
      }

      if (!progress.completedLectures.includes(lecture._id)) {
        progress.completedLectures.push(lecture._id);
        await progress.save();
      }

      return progress;
    },
    createPaymentOrder: async (_, { amount, courseId }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      // Check if Razorpay is initialized
      if (!razorpay) {
        throw new Error('Payment service is not configured. Please contact support.');
      }

      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `order_${courseId}_${Date.now()}`,
        payment_capture: 1
      };

      try {
        const order = await razorpay.orders.create(options);
        return {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          status: order.status
        };
      } catch (error) {
        throw new Error('Failed to create payment order');
      }
    },
    verifyPayment: async (_, { orderId, paymentId, signature }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      // Check if Razorpay is initialized
      if (!razorpay) {
        throw new Error('Payment service is not configured. Please contact support.');
      }

      // Check if RAZORPAY_KEY_SECRET is available
      if (!process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Payment verification is not configured. Please contact support.');
      }

      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new Error('Invalid payment signature');
      }

      return {
        success: true,
        message: 'Payment verified successfully'
      };
    },
    enrollCourse: async (_, { courseId }, { user }) => {
      try {
        if (!user) {
          throw new Error('Not authenticated');
        }

        const course = await Course.findById(courseId);
        if (!course) {
          throw new Error('Course not found');
        }

        // Check if user is already enrolled
        if (course.students.includes(user.userId)) {
          throw new Error('Already enrolled in this course');
        }

        course.students.push(user.userId);
        await course.save();

        // Add course to user's courses
        const currentUser = await User.findById(user.userId);
        currentUser.courses.push(courseId);
        await currentUser.save();

        return course;
      } catch (error) {
        console.error('Error enrolling in course:', error);
        throw error;
      }
    },
  }
};

module.exports = resolvers; 