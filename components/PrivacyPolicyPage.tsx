
import React from 'react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">{children}</h3>
);

const PrivacyPolicyPage = ({ t }: { t: (key: string) => string }) => {
    return (
        <div className="w-full max-w-4xl mx-auto my-8 animate-fade-in-up text-gray-900">
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                    Privacy Policy
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                    Your privacy is important to us. Here's how we handle your data (or rather, how we don't).
                </p>
            </div>

            <div className="mt-12 bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-gray-200 text-gray-700 leading-relaxed">
                <p className="text-sm text-gray-500">Last Updated: October 26, 2023</p>

                <SectionTitle>1. The Short Version</SectionTitle>
                <p>
                    CreatorTune is designed to be a privacy-first tool. We do not collect, store, or share any of your personal data. You can use our tools without logging in or providing any personal information.
                </p>
                
                <SectionTitle>2. What Information We Don't Collect</SectionTitle>
                <p>
                    We do not use cookies for tracking, and we do not collect any personally identifiable information (PII) such as your name, email address, IP address, or location. The YouTube channel URLs or content details you enter are sent to our AI provider for analysis but are not stored or associated with you on our servers.
                </p>

                <SectionTitle>3. The Only Exception: Voluntary Feedback</SectionTitle>
                <p>
                    The only time we might receive your data is if you voluntarily choose to send us feedback, for example, through a contact form or by email. In this case, we would only have the information you choose to provide (like your email address and the content of your message). This information is used solely for the purpose of responding to your feedback and improving the tool. We will never sell or share this information.
                </p>

                <SectionTitle>4. Third-Party AI Services</SectionTitle>
                <p>
                    To provide the analysis, we send the content you submit (like channel URLs or video titles) to our AI service provider (Google Gemini). Their use of this data is governed by their own privacy policies. We do not send them any personal information that could identify you.
                </p>

                <SectionTitle>5. Changes to This Policy</SectionTitle>
                <p>
                    We may update this Privacy Policy from time to time. If we make changes, we will update the "Last Updated" date at the top of this page. Your continued use of the Service after any changes constitutes your acceptance of the new policy.
                </p>

                <SectionTitle>6. Contact Us</SectionTitle>
                <p>
                    If you have any questions about this Privacy Policy, please don't hesitate to reach out.
                    <br />
                    Email: <a href="mailto:sy8936216@gmail.com" className="text-purple-600 font-semibold hover:underline">sy8936216@gmail.com</a>
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;