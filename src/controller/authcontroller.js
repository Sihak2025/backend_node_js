/** @format */

import bcrypt from 'bcrypt';
import { prisma } from '../config/db.js';
import { generatetoken } from '../utils/generateToken.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  //Check if user already exists
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });
  if (userExists) {
    return res.status(401).json({
      message: 'Email already exists....',
    });
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  //check user email exists in table
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    return res.status(401).json({
      message: 'Email or Password invalid',
    });
  }

  //verify password
  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) {
    res.status(401).json({
      message: 'Email or Password invalid',
    });
  }

  //generate token
  const token = await generatetoken(user.id, res);
  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: email,
        role: user.role,
      },
      token,
    },
  });
};

const logout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: 'success',
    message: 'Logout successfully',
  });
};

const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if (!users) {
      return res.status(404).json({
        success: false,
        error: 'User not found...!',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'User get all successfully...!',
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: 'Delete user successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server is error...!',
    });
  }
};
export { register, login, logout, getAllUser, deleteUser };
