const jwt = require('jsonwebtoken')
const User = require('../models/user')

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1hr' })
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const isExist = await User.findOne({ email })
        if (isExist) return res.status(400).json({ message: 'Email is already in use.' })

        const userData = {
            name,
            email,
            password
        }
        const user = await User.create(userData)
        res.status(201).json({ message: 'User Registered Successfully', data: user })
    } catch (error) {
        return res.status(500).json({ message: 'Server error.' })

    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' })

        if (user.locked && user.lockUntil > Date.now()) return res.status(403).json({ message: 'Account is Suspended. Try after sometime' })

        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            user.loginAttempts = user.loginAttempts + 1
            if (user.loginAttempts >= 3) {
                user.locked = true;
                user.lockUntil = Date.now() + 30 * 60 * 1000
            }
            await user.save()
            return res.status(400).json({
                message: 'Invalid credentials.',
                remainingAttempts: 3 - user.loginAttempts,
            })
        }
        user.loginAttempts = 0;
        user.locked = false;
        user.lockUntil = null;
        await user.save();

        const token = generateToken(user)
        res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error.' })

    }
}


const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) return res.status(404).json({ message: 'User not found.' })
        if (user.locked) return res.status(403).json({ message: 'Account is locked' })
        res.status(200).json({ message: 'User fetched successfully.', data: user })
    } catch (error) {
        return res.status(500).json({ message: 'Server error.' })
    }
}


const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        if (!users || !users.length) return res.status(404).json({ message: 'None of the users are exist' })
        res.status(200).json({ message: 'Users listed successfully', data: users })
    } catch (error) {
        return res.status(500).json({ message: 'Server error.' })
    }
}


const adminUnlock = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' })
        if (!user.locked) return res.status(400).json({ message: 'Account is not locked' })

        user.locked = false
        user.lockUntil = null
        user.loginAttempts = 0

        await user.save()
        return res.status(200).json({ message: 'Account unlocked successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error.' })
    }
}


module.exports = { register, login, getProfile, getUsers, adminUnlock }