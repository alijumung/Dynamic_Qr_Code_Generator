import React from 'react';
import { AnimatePresence, motion } from "framer-motion";

function NotFoundError() {
    return (
        <AnimatePresence>
            <motion.div
                className="flex items-center justify-center h-screen" // Center both vertically and horizontally
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                <div className="text-center"> {/* Center content */}
                    <h1 className="text-6xl font-bold text-textColor mb-4">404</h1>
                    <p className="text-2xl text-textColor">Page Not Found!</p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default NotFoundError;
