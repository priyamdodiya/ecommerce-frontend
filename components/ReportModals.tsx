import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ReportModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onRequestClose}
        >
          <motion.div
            className="w-11/12 max-w-lg overflow-hidden rounded-lg bg-white shadow-xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold">Report this review</h2>
                <button onClick={onRequestClose}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500 hover:text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-500">Optional: Why are you reporting this?</p>
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="form-checkbox text-blue-500" />
                  <span>
                    <p className="font-semibold">Off topic</p>
                    <p className="text-xs text-gray-500">Not about the product</p>
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="form-checkbox text-blue-500" />
                  <span>
                    <p className="font-semibold">Inappropriate</p>
                    <p className="text-xs text-gray-500">Disrespectful, hateful, obscene</p>
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="form-checkbox text-blue-500" />
                  <span>
                    <p className="font-semibold">Fake</p>
                    <p className="text-xs text-gray-500">Paid for, inauthentic</p>
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="form-checkbox text-blue-500" />
                  <span>
                    <p className="font-semibold">Other</p>
                    <p className="text-xs text-gray-500">Something else</p>
                  </span>
                </label>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                Well check if this review meets our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  community guidelines
                </a>
                . If it doesnt, well remove it.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={onRequestClose}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-shop_light_green px-4 py-2 text-white hover:bg-shop_light_green_dark"
                  onClick={onSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ThankYouModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onRequestClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onRequestClose}
        >
          <motion.div
            className="w-11/12 max-w-lg overflow-hidden rounded-lg bg-white shadow-xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold">Report this review</h2>
                <button onClick={onRequestClose}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500 hover:text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="py-8 text-center">
                <h3 className="text-xl font-bold">Thank you for your report</h3>
                <p className="mt-2 text-sm text-gray-500">Well investigate in the next few days.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};