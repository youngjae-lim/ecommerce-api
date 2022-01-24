import User from '../models/User.js'

const register = async (req, res) => {
  res.send('register')
}

const login = async (req, res) => {
  res.send('login')
}

const logout = async (req, res) => {
  res.send('logout')
}

export { register, login, logout }
