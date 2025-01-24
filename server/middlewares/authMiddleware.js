import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Check if token is in cookies (or headers)
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log('No token found');
        return res.status(403).json({ error: "You are not authenticated" });
    }

    // Ensure the secret key is set in the environment variable
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in the environment variables');
        return res.status(500).json({ error: "Internal Server Error: Missing JWT secret key" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // Log the secret key and token for debugging


        if (err) {
            console.log('Token verification failed:', err);
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        req.user = decoded;
        next();
    });
};

export default authMiddleware;
