import { useLocation, useNavigate, Link } from "react-router";
import { useEffect, useRef, useState } from "react";

function FoundForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const nodeid = location.state?.nodeid;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [imageData, setImageData] = useState("");
  const [guardName, setGuardName] = useState("");

  useEffect(() => {
    if (nodeid === undefined) {
      navigate("/found");
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    let stream;
    let cancelled = false;

    async function loadVideo() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
        });

        if (video && !cancelled) {
          video.srcObject = stream;

          const playPromise = video.play();

          if (playPromise !== undefined) {
            await playPromise;
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Camera access failed:", err);
        }
      }
    }

    loadVideo();

    return () => {
      cancelled = true;

      if (video) {
        video.pause();
        video.srcObject = null;
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [imageData]);

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      const width = video.videoWidth;
      const height = video.videoHeight;

      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      setImageData(canvas.toDataURL("image/png"));
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "90vh" }}>
      <div className="py-5 px-5 w-full max-w-xl self-center">
        <Link to="/found" aria-label="Back to Found Page">
          <svg
            width="14"
            height="22"
            viewBox="0 0 14 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3333 21.8333L0.5 11L11.3333 0.166664L13.2562 2.08958L4.34583 11L13.2562 19.9104L11.3333 21.8333Z"
              fill="white"
            />
          </svg>
        </Link>
      </div>

      <div className="flex flex-col items-center w-full max-w-xl mx-auto gap-10">
        <div className="flex flex-col w-6/12 items-center gap-2">
          {imageData.length != 0 || (
            <video
              ref={videoRef}
              className="border-white shadow-lg border rounded-lg"
              muted
              playsInline
            ></video>
          )}
          <canvas
            className="hidden"
            ref={canvasRef}
            width={0}
            height={0}
          ></canvas>

          {imageData.length != 0 && (
            <img src={imageData} className="border-white shadow-lg border rounded-lg" />
          )}

          {imageData.length != 0 || (
            <button
              className="w-full bg-yellow-300 text-center py-5 rounded-md font-semibold border-black border hover:bg-yellow-400"
              onClick={handleTakePhoto}
            >
              Take Photo
            </button>
          )}

          {imageData.length != 0 && (
            <button
              className="w-full bg-yellow-300 text-center py-5 rounded-md font-semibold border-black border hover:bg-yellow-400"
              onClick={() => setImageData("")}
            >
              Retake Photo
            </button>
          )}
        </div>

        <div class="flex flex-col w-full items-center gap-3">
          <input
            value={guardName}
            onChange={(e) => {setGuardName(e.target.value)}}
            type="Text"
            className="bg-white rounded-md w-10/12 p-4"
            placeholder="Name of Guard"
          />

          <button
            disabled={imageData.length == 0 || guardName.length == 0}
            className="w-10/12 bg-yellow-300 disabled:bg-yellow-600 text-center py-5 rounded-md font-semibold border-black border hover:bg-yellow-400"
            onClick={async () => {
              const response = await fetch("/api/found", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  nodeid,
                  imageData,
                  guardName
                }),
              });
              const json = await response.json();

              navigate(`/lost/${json.itemid}`);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoundForm;
