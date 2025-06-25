import { useState } from "react";
import logoText from '../assets/logo-text.svg';
import { useNavigate } from "react-router";

function Index() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = () => {
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const okay = email.endsWith('iskolarngbayan.pup.edu.ph');

    if (!okay || !isValidFormat) {
      setError("Invalid Webmail");
    } else {
      navigate('/features');
    }
  };

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-md text-center space-y-5">
        <img src={logoText} className="mx-auto mt-5 mb-10" />
        <h1 className="font-bold text-2xl text-yellow-300 mt-30">LOGIN</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white w-full border border-black rounded-lg p-3"
          placeholder="PUP Webmail"
        />
        {error && (
          <p className="text-red-600 font-medium">{error}</p>
        )}
        <button
          type="button"
          onClick={validateEmail}
          className="w-full bg-red-500 rounded-lg p-3 text-white cursor-pointer border border-black"
        >
          LOG IN
        </button>
      </div>
    </div>
  );
}

export default Index;
