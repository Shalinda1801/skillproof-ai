import { motion } from "framer-motion";

const Reveal = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;