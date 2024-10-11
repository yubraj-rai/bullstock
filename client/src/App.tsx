import './index.css';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-xl w-full transform hover:scale-105 transition-all duration-500"
      >
        <h1 className="text-4xl font-bold text-center mb-4 text-purple-800 animate-pulse">
          LongJohnMethods
        </h1>
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-800">
          Bullstock - Stock Trading Application
        </h2>

        <motion.h3
          className="text-lg font-semibold mb-4 text-gray-900"
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Project Team Members:
        </motion.h3>
        <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-700">
          <motion.li whileHover={{ scale: 1.1, color: '#5D3FD3' }}>
            Hirak Rajendrakumar Babariya
          </motion.li>
          <motion.li whileHover={{ scale: 1.1, color: '#5D3FD3' }}>
            Dhru Manishkumar Patel
          </motion.li>
          <motion.li whileHover={{ scale: 1.1, color: '#5D3FD3' }}>
            Krishna Patel
          </motion.li>
          <motion.li whileHover={{ scale: 1.1, color: '#5D3FD3' }}>
            Yubraj Rai
          </motion.li>
        </ul>

        <motion.div
          className="text-center text-sm text-gray-600 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <p>2024F-T4 CPL 5559 - WIL Project 05 (FSDM Group 1)</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
