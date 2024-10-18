import { Request, Response } from "express";
import userModel from "../model/userModel";
import comparePassword from "../../utils/comparePassword";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bcryptPassword from "../../utils/bcryptPassword";
import { tokenBlacklist } from "../../utils/blacklist";
import upload_image from "../../utils/multer";

const register = async (req: Request, res: Response) => {
    const { firstName, lastName, mobileNo, password, email} = req.body;
    const image = req.file?.filename;
    try {
        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "User already exists"
            });
        }
        const hashedPassword = await bcryptPassword(password)
        const newUser = await userModel.create({
            firstName,
            lastName,
            mobileNo,
            email,
            password: hashedPassword,
            image:image,
        })
        res.status(201).json({
            status: true,
            message: 'User registered successfully',
            data: newUser
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}
const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        const existingAdmin: any = await userModel.findOne({ email });
        if (!email) {
            return res.status(404).json({
                status: false,
                message: "User not found."
            })
        }
        const isPasswordValid = await comparePassword(
            existingAdmin.password,
            password
        )
        if (!isPasswordValid) {
            return res.status(404).json({
                status: false,
                message: "Incorrect password."
            })
        }
        const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_JWT!);
        const user = await userModel.findOneAndUpdate({ _id: existingAdmin._id }, { token: token }, { new: true })
        const userResult = {
            _id: existingAdmin._id,
            firstName: existingAdmin.firstName,
            lastName: existingAdmin.lastName,
            mobileNo: existingAdmin.mobileNo,
            email: existingAdmin.email,
            image: existingAdmin.image,
            token: token
        }
        return res.status(200).json({
            status: true,
            message: "User login successfully.",
            data: userResult,
        });
    } catch (error: any) {
        return res
            .status(500)
            .json({ status: false, message: error.message });
    }

}
const editUser = async (req: Request, res: Response) => {
    const { id } = req.body.adminDecoded
    const { email, firstName, lastName, mobileNo, } = req.body
    try {
        const edituser = await userModel.findByIdAndUpdate(id, {
            firstName: firstName,
            email: email,
            lastName: lastName,
            mobileNo: mobileNo
        },
            { new: true })
        return res.status(200).json({
            status: true,
            message: "User edit successfully.",
            data: edituser
        })
    } catch (error: any) {
        return res
            .status(500)
            .json({ status: false, message: error.message });
    }
}
const changePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword, confirmPassword } = req.body
    const { id } = req.body.adminDecoded;
    try {
        const user = await userModel.findById(id)
        if (!user) {
            return res
                .status(404)
                .json({ status: false, error: "User is not found." });
        }
        const isOldPasswordValid = comparePassword(
            user.password,
            oldPassword
        )
        if (!isOldPasswordValid) {
            return res.status(400).json({
                status: false,
                message:
                    "Reset password failed. The old password provided is incorrect.",
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: false,
                message: "password do not match"
            })
        } else {
            const hashedPassword = await bcryptPassword(newPassword)
            await userModel.findByIdAndUpdate(id, {
                password: hashedPassword
            },
                { new: true })
        }
        return res.status(200).json({
            status: true,
            message: "password changed."
        })
    } catch (error: any) {
        return res
            .status(500)
            .json({ status: false, message: error.message });
    }
}
const logout = async (req: Request, res: Response) => {
    try {
        const id = req.body.adminDecoded.id;
        const adminToken = await userModel.findById(id);
        const blackList = adminToken?.token;
        if (blackList) {
            tokenBlacklist.push(blackList);
        }
        await userModel.findOneAndUpdate({ _id: id }, { token: null });
        return res
            .status(200)
            .json({ status: true, message: "Logged out successfully." });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: false, message: "Internal server error." });
    }
}

export default { login, register, editUser, changePassword, logout }