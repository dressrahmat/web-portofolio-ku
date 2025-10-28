// ContactSection.jsx - Disesuaikan untuk Product & Fullstack Developer
import { motion } from "framer-motion";
import AnimatedSection from "@/Components/AnimatedSection";

export default function ContactSection() {
    return (
        <AnimatedSection id="contact" className="py-28 max-w-5xl mx-auto px-4">
            <motion.h2
                className="text-4xl font-medium mb-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                Let's Build Something Amazing
            </motion.h2>

            <motion.p
                className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Ready to transform your idea into a scalable digital product?
                Let's discuss how we can bring your vision to life with solid
                backend architecture and holistic product development.
            </motion.p>

            <div className="grid md:grid-cols-5 gap-12">
                <motion.div
                    className="md:col-span-2"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="text-2xl font-medium mb-6">
                        Start a Conversation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Whether you need a{" "}
                        <span className="font-semibold text-gray-900 dark:text-gray-200">
                            fullstack solution
                        </span>
                        , want to optimize your{" "}
                        <span className="font-semibold text-gray-900 dark:text-gray-200">
                            backend architecture
                        </span>
                        , or build a{" "}
                        <span className="font-semibold text-gray-900 dark:text-gray-200">
                            digital product from scratch
                        </span>{" "}
                        - I'm here to help bring technical excellence to your
                        project.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium mb-1">Email</h4>
                                <a
                                    href="mailto:hello@example.com"
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    hello@example.com
                                </a>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Fastest way to reach me
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-green-600 dark:text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium mb-1">LinkedIn</h4>
                                <a
                                    href="https://linkedin.com/in/yourprofile"
                                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                >
                                    linkedin.com/in/yourprofile
                                </a>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Professional connection
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium mb-1">GitHub</h4>
                                <a
                                    href="https://github.com/yourusername"
                                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                >
                                    github.com/yourusername
                                </a>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Check out my code
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-orange-600 dark:text-orange-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium mb-1">
                                    Response Time
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Within 24 hours
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Usually much faster
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="md:col-span-3"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/20 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
                        <h3 className="text-2xl font-medium mb-6">
                            Project Inquiry
                        </h3>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Work Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="you@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="project-type"
                                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Project Type
                                </label>
                                <select
                                    id="project-type"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">
                                        Select project type
                                    </option>
                                    <option value="web-app">
                                        Web Application Development
                                    </option>
                                    <option value="backend">
                                        Backend System Architecture
                                    </option>
                                    <option value="fullstack">
                                        Fullstack Product Development
                                    </option>
                                    <option value="consultation">
                                        Technical Consultation
                                    </option>
                                    <option value="mvp">MVP Development</option>
                                    <option value="legacy">
                                        Legacy System Upgrade
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="budget"
                                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Project Budget Range
                                </label>
                                <select
                                    id="budget"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">
                                        Select budget range
                                    </option>
                                    <option value="5-10">$5K - $10K</option>
                                    <option value="10-25">$10K - $25K</option>
                                    <option value="25-50">$25K - $50K</option>
                                    <option value="50+">$50K+</option>
                                    <option value="discuss">
                                        Let's discuss
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Project Details
                                </label>
                                <textarea
                                    id="message"
                                    rows="5"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Tell me about your project goals, technical requirements, timeline, and any specific challenges you're facing..."
                                    required
                                ></textarea>
                            </div>

                            <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-3 h-3 text-blue-600 dark:text-blue-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    I'll get back to you with initial thoughts
                                    and questions within 24 hours
                                </p>
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                <span>Start Project Discussion</span>
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatedSection>
    );
}
