const express = require('express');

const getUsers = (req, res) => {
    res.send('Hello, this nice world')
}

const getUserById = (req, res) => {
    res.send('Hello');
}

module.exports = { getUsers, getUserById };