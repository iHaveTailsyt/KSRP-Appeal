'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [form, setForm] = useState({ username: '', reason: '', appeal: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [status, setStatus] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [disclaimerFadeOut, setDisclaimerFadeOut] = useState(false);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    if (showDisclaimer && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [showDisclaimer, timer]);

  const handleContinue = () => {
    setDisclaimerFadeOut(true);
    setTimeout(() => {
      setShowDisclaimer(false);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setStatus('❌ You must accept the terms before submitting.');
      return;
    }

    setStatus('Submitting...');
    try {
      await axios.post('/api/submitAppeal', form);
      setStatus('✅ Appeal submitted successfully!');
      setForm({ username: '', reason: '', appeal: '' });
      setAcceptedTerms(false);
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to submit appeal.');
    }
  };

  if (showDisclaimer) {
    return (
      <main className={`min-h-screen bg-black text-white flex items-center justify-center px-4 transition-all ${disclaimerFadeOut ? 'animate-fade' : 'animate-fadein'}`}>
        <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl max-w-2xl text-center shadow-2xl">
          <h1 className="text-3xl font-bold mb-4 text-red-500">🚨 KSRP Security Advisory</h1>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed text-justify">
            Welcome to the official <strong>KSRP</strong> Disciplinary Appeal Portal. This platform is used exclusively by the <strong>Development Operations Team</strong> for handling appeals regarding disciplinary actions.
            <br /><br />
            All appeals are logged and considered <strong>official records</strong>. Any dishonest, abusive, or inappropriate use of this system will result in <strong>permanent removal</strong> from the KSRP team and all related communities.
            <br /><br />
            Sharing this portal or its contents outside authorized personnel is strictly forbidden and will result in a <strong>blacklist</strong> from all KSRP internal systems.
          </p>
          <button
            disabled={timer > 0}
            onClick={handleContinue}
            className={`px-6 py-3 rounded-lg font-semibold text-white w-full mt-4 ${
              timer > 0
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 transition'
            }`}
          >
            {timer > 0 ? `Acknowledge & Continue (${timer}s)` : 'I Understand & Accept Responsibility'}
          </button>
          <p className="text-xs mt-4 text-gray-500 italic">
            You confirm that you are authorized and understand the consequences of misuse.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-4 animate-fadein">
      <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          🚨 KSRP Disciplinary Appeal Form
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium">Discord Username</label>
            <input
              type="text"
              placeholder="e.g. CoolUser#1234"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Punishment Reason</label>
            <input
              type="text"
              placeholder="e.g. Inappropriate language"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              required
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Your Appeal</label>
            <textarea
              placeholder="Explain why you believe your punishment should be lifted..."
              value={form.appeal}
              onChange={(e) => setForm({ ...form, appeal: e.target.value })}
              required
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 border border-gray-700 h-36 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="mt-1"
            />
            <label className="text-sm text-gray-300 leading-tight">
              I confirm that all information provided is accurate and I accept the{' '}
              <span className="underline cursor-pointer text-blue-400 hover:text-blue-300">
                KSRP Appeal Terms and Conditions
              </span>
              .
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:scale-105"
          >
            📩 Submit Appeal
          </button>
          <p className="text-sm text-center mt-2 text-green-400">{status}</p>
        </form>
        <p className="text-xs text-center text-gray-400 mt-6">
          Appeals are reviewed directly by the KSRP staff team via internal systems.
        </p>
        <p className="text-xs text-center text-gray-500 mt-3">
          Developed with ❤️ by bunbun for KSRP
        </p>
      </div>
    </main>
  );
}
