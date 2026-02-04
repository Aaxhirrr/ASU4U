"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/peerconnect.css";

const STUDENT_TYPES = [
    { value: "first-gen", label: "First-Generation Student" },
    { value: "international", label: "International Student" },
    { value: "out-of-state", label: "Out-of-State Student" },
    { value: "transfer", label: "Transfer Student" },
    { value: "returning", label: "Returning Adult Student" },
    { value: "other", label: "Other" },
];

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

const INTEREST_OPTIONS = [
    "Technology", "Gaming", "Music", "Photography", "Fitness", "Travel",
    "Reading", "Art", "Nature", "Movies", "Sports", "Cooking",
    "Programming", "Dance", "Writing", "Volunteering", "Fashion", "Science"
];

const COURSE_EXAMPLES = [
    "CSE 110", "CSE 205", "CSE 310", "CSE 340",
    "MAT 265", "MAT 266", "MAT 343",
    "PHY 121", "PHY 131", "CHM 113",
    "ENG 101", "ENG 102", "COM 100",
    "PSY 101", "SOC 101", "ECN 211"
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

export default function CreateProfilePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [[page, direction], setPage] = useState([1, 0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        major: "",
        year: "",
        studentType: "",
        age: "",
        hideAge: false,
        courses: [] as string[],
        interests: [] as string[],
        about: "",
    });

    const handleNext = () => {
        if (step < 4) {
            setPage([step + 1, 1]);
            setStep(step + 1);
        } else {
            setIsSubmitting(true);
            setTimeout(() => {
                router.push("/journal");
            }, 500);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setPage([step - 1, -1]);
            setStep(step - 1);
        }
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const toggleCourse = (course: string) => {
        setFormData(prev => ({
            ...prev,
            courses: prev.courses.includes(course)
                ? prev.courses.filter(c => c !== course)
                : [...prev.courses, course]
        }));
    };

    return (
        <div className="peerconnect-page min-h-screen py-8 px-4 overflow-hidden relative" style={{ backgroundColor: 'hsl(40 30% 96%)' }}>
            {/* Animated background */}
            <motion.div
                className="absolute w-72 h-72 rounded-full blur-3xl opacity-20"
                style={{ background: 'hsl(340 66% 33% / 0.3)', top: '10%', left: '-10%' }}
                animate={{
                    x: [0, 30, 0],
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute w-64 h-64 rounded-full blur-3xl opacity-15"
                style={{ background: 'hsl(45 100% 58% / 0.4)', bottom: '10%', right: '-5%' }}
                animate={{
                    x: [0, -20, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div className="max-w-lg mx-auto relative z-10">
                <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <Image src="/assets/peerconnect-logo.png" alt="PeerConnect" width={60} height={60} className="mx-auto h-16 w-16" />
                    </motion.div>
                    <motion.h1
                        className="text-xl font-bold mt-4"
                        style={{ color: 'hsl(340 66% 33%)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Create Your Profile
                    </motion.h1>
                    <motion.p
                        className="text-sm mt-1"
                        style={{ color: 'hsl(340 10% 45%)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Step {step} of 4
                    </motion.p>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    className="flex gap-2 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {[1, 2, 3, 4].map((s) => (
                        <motion.div
                            key={s}
                            className="flex-1 h-2 rounded-full overflow-hidden"
                            style={{ backgroundColor: 'hsl(40 15% 88%)' }}
                        >
                            <motion.div
                                className="h-full"
                                style={{ backgroundColor: 'hsl(340 66% 33%)' }}
                                initial={{ width: 0 }}
                                animate={{ width: s <= step ? '100%' : '0%' }}
                                transition={{ duration: 0.5, delay: s * 0.1 }}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="peerconnect-user-card p-6 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                        >
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'hsl(340 20% 15%)' }}>Basic Information</h2>

                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="text-sm font-medium" style={{ color: 'hsl(340 20% 15%)' }}>Full Name</label>
                                        <motion.input
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="peerconnect-search w-full pl-3"
                                            data-testid="input-profile-name"
                                            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px hsl(340 66% 33% / 0.1)" }}
                                        />
                                    </motion.div>

                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="text-sm font-medium" style={{ color: 'hsl(340 20% 15%)' }}>Major</label>
                                        <motion.input
                                            placeholder="e.g., Computer Science"
                                            value={formData.major}
                                            onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                                            className="peerconnect-search w-full pl-3"
                                            data-testid="input-profile-major"
                                            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px hsl(340 66% 33% / 0.1)" }}
                                        />
                                    </motion.div>

                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="text-sm font-medium" style={{ color: 'hsl(340 20% 15%)' }}>Year</label>
                                        <div className="flex flex-wrap gap-2">
                                            {YEAR_OPTIONS.map((year, idx) => (
                                                <motion.button
                                                    key={year}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, year }))}
                                                    className={formData.year === year ? "peerconnect-badge" : "peerconnect-badge-outline"}
                                                    data-testid={`button-year-${year}`}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {year}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <label className="text-sm font-medium" style={{ color: 'hsl(340 20% 15%)' }}>Student Type</label>
                                        <select
                                            value={formData.studentType}
                                            onChange={(e) => setFormData(prev => ({ ...prev, studentType: e.target.value }))}
                                            className="peerconnect-search w-full pl-3"
                                            data-testid="select-student-type"
                                        >
                                            <option value="">Select student type</option>
                                            {STUDENT_TYPES.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </motion.div>

                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <label className="text-sm font-medium" style={{ color: 'hsl(340 20% 15%)' }}>Age (optional)</label>
                                        <div className="flex items-center gap-4">
                                            <motion.input
                                                type="number"
                                                placeholder="Your age"
                                                value={formData.age}
                                                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                                                className="peerconnect-search w-24 pl-3"
                                                data-testid="input-profile-age"
                                                whileFocus={{ boxShadow: "0 0 0 3px hsl(340 66% 33% / 0.1)" }}
                                            />
                                            <label className="flex items-center gap-2 text-sm" style={{ color: 'hsl(340 10% 45%)' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.hideAge}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, hideAge: e.target.checked }))}
                                                    className="w-4 h-4"
                                                />
                                                Hide age on profile
                                            </label>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'hsl(340 20% 15%)' }}>Current Courses</h2>
                                    <p className="text-sm" style={{ color: 'hsl(340 10% 45%)' }}>Select courses you're taking (helps find study partners):</p>
                                    <motion.div
                                        className="flex flex-wrap gap-2 max-h-60 overflow-y-auto"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {COURSE_EXAMPLES.map((course, idx) => (
                                            <motion.button
                                                key={course}
                                                type="button"
                                                onClick={() => toggleCourse(course)}
                                                className={`flex items-center gap-1 ${formData.courses.includes(course) ? "peerconnect-badge" : "peerconnect-badge-outline"}`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.03 }}
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <AnimatePresence>
                                                    {formData.courses.includes(course) && (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            exit={{ scale: 0 }}
                                                        >
                                                            <Check className="h-3 w-3" />
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                                {course}
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                    <motion.p
                                        className="text-xs"
                                        style={{ color: 'hsl(340 10% 45%)' }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        Selected: {formData.courses.length} courses
                                    </motion.p>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'hsl(340 20% 15%)' }}>Your Interests</h2>
                                    <p className="text-sm" style={{ color: 'hsl(340 10% 45%)' }}>Select interests to find like-minded peers:</p>
                                    <motion.div
                                        className="flex flex-wrap gap-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {INTEREST_OPTIONS.map((interest, idx) => (
                                            <motion.button
                                                key={interest}
                                                type="button"
                                                onClick={() => toggleInterest(interest)}
                                                className={`flex items-center gap-1 ${formData.interests.includes(interest) ? "peerconnect-badge" : "peerconnect-badge-outline"}`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.03 }}
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <AnimatePresence>
                                                    {formData.interests.includes(interest) && (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            exit={{ scale: 0 }}
                                                        >
                                                            <Check className="h-3 w-3" />
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                                {interest}
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                    <motion.p
                                        className="text-xs"
                                        style={{ color: 'hsl(340 10% 45%)' }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        Selected: {formData.interests.length} interests
                                    </motion.p>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-semibold" style={{ color: 'hsl(340 20% 15%)' }}>About You</h2>
                                        <motion.div
                                            animate={{ rotate: [0, 15, -15, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Sparkles className="h-5 w-5" style={{ color: 'hsl(45 100% 50%)' }} />
                                        </motion.div>
                                    </div>
                                    <p className="text-sm" style={{ color: 'hsl(340 10% 45%)' }}>Share a bit about yourself:</p>
                                    <motion.textarea
                                        placeholder="Tell others about yourself, your goals, and what you're looking for in friends..."
                                        value={formData.about}
                                        onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                                        className="peerconnect-search w-full min-h-[150px] p-3 resize-none"
                                        data-testid="input-profile-about"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileFocus={{ boxShadow: "0 0 0 3px hsl(340 66% 33% / 0.1)" }}
                                    />
                                    <p className="text-xs" style={{ color: 'hsl(340 10% 45%)' }}>
                                        {formData.about.length}/500 characters
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <motion.div
                        className="flex gap-3 mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {step > 1 ? (
                            <motion.button
                                type="button"
                                onClick={handleBack}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md border font-medium"
                                style={{ borderColor: 'hsl(40 15% 80%)', color: 'hsl(340 10% 45%)' }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Back
                            </motion.button>
                        ) : (
                            <div className="flex-1" />
                        )}
                        <motion.button
                            type="button"
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="peerconnect-befriend-btn flex-1 justify-center py-2.5"
                            data-testid={step === 4 ? "button-complete-profile" : "button-next-step"}
                            whileHover={{ scale: 1.02, boxShadow: "0 8px 25px hsl(340 66% 33% / 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSubmitting ? "Creating..." : step === 4 ? (
                                <>
                                    <Check className="h-4 w-4" />
                                    Complete
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
