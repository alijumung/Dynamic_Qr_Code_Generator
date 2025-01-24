import db from "../config/db.js"; // Database connection
import multer from "multer";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads");
        const qrDir = path.join(uploadDir, "qr_codes");
        const pageDir = path.join(uploadDir, "pages");

        // Ensure directories exist
        [uploadDir, qrDir, pageDir].forEach((dir) => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        });

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage }).single("qr_video");

const getAbsolutePath = (relativePath) => path.join(__dirname, "../uploads", relativePath);

export const QrEdit = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("Error uploading file:", err);
            return res.status(500).json({ error: "Error uploading file." });
        }

        const { id } = req.params;
        const { qr_name, qr_link, qr_not, qr_author } = req.body;
        const qr_video = req.file ? req.file.filename : null;

        if (!id || !qr_name || !qr_link || !qr_not || !qr_author ) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const selectQuery = `SELECT qr_page_path, qr_video FROM qr_codes WHERE id = ?`;
        db.query(selectQuery, [id], async (err, results) => {
            if (err) {
                console.error("Error fetching current QR data:", err);
                return res.status(500).json({ error: "Failed to fetch current QR code data." });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "QR code not found." });
            }

            const currentData = results[0];
            const qrPagePath = currentData.qr_page_path;
            const existingVideo = currentData.qr_video;

            const updatedVideo = qr_video || existingVideo;

            const updateQuery = `
                UPDATE qr_codes
                SET qr_name = ?, qr_link = ?, qr_not = ?, qr_video = ?, qr_author = ?
                WHERE id = ?
            `;
            db.query(updateQuery, [qr_name, qr_link, qr_not, qr_author, updatedVideo, id], async (err) => {
                if (err) {
                    console.error("Error updating QR data:", err);
                    return res.status(500).json({ error: "Database update failed." });
                }

                try {
                    const videoTag = updatedVideo
                        ? `<video controls src="https://${req.get("host")}/api/uploads/${updatedVideo}"></video>`
                        : "";

                    const Favicon = `https://${req.get("host")}/api/uploads/icon.png`; // Reference the server bg image

                    const htmlContent = `
                  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" type="image/png" href="${Favicon}" />
    <title>${qr_name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script src="https://cdn.jsdelivr.net/npm/tsparticles@2.11.0"></script>
    <script>
  tailwind.config = {
    theme: {
      extend: {
        letterSpacing: {
          widest: "0.3em", // Correct syntax with unit
          wider: "0.2em", // Added unit
        },
        colors: {
          primary: "#8f8cee", // Example primary color
          secondary: "#8a1479", // Example secondary color
          accent: "#e0248b", // Example accent color
          textColor: "#e1e0fa", // Example custom gray
          backGround: "#070524",
        },
        fontWeight: {
          customBold: "500", // Corrected definition as an object
        },
        fontSize: {
        '6xl': ['244.3px', { lineHeight: '60px' }], // Custom font size to match dimensions
      },
    },
  };
</script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap');
        @import url('https://fonts.cdnfonts.com/css/gobold');
	@import url('https://fonts.cdnfonts.com/css/rakesly');
	p {
	font-family: 'Rakesly', sans-serif;
	
	}
        @font-face {
            src: url("https://www.axis-praxis.org/fonts/webfonts/MetaVariableDemo-Set.woff2")
            format("woff2");
            font-family: "Meta";
            font-style: normal;
            font-weight: normal;
        }
        h1{
           font-family: 'Gobold High Bold', sans-serif; 
        }

        body {
            font-family: 'Gobold', sans-serif;
           
            background-color: white; 
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            margin: 0;
        }
        #tsparticles {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
       
       .cussstom_font {
            font-family: "Gobold Thin Light", sans-serif;
        }
       video {
     
         width: 244.3px;
  height: 507.1px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 20px;
  border-color: #000;
  border: 2px solid #000;
            
       } 
       .play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  color: #fff;
  font-size: 50px;
  width: 80px;
  height: 80px;
  z-index: 2;
  border-radius: 50%;
  position: relative;
}
.play-btn:before {
  content: '';
  position: absolute;
  border: 15px solid #fff;
  border-radius: 50%;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  animation: bloom1 1.5s linear infinite;
  opacity: 0;
  z-index: 1;
}
.play{
    width: 25px;
    height:auto;

}

.play-btn:after {
  content: '';
  position: absolute;
  border: 15px solid #fff;
  border-radius: 50%;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  animation: bloom2 1.5s linear infinite;
  opacity: 0;
  animation-delay: 0.4s;
  z-index: 1;
}
.play-btn:hover{
    cursor: pointer;
}

@keyframes bloom1 {
  0% {
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
  }
}

@keyframes bloom2 {
  0% {
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
  }
}



    </style>
</head>
<body>

<!-- Header -->
<header class="text-center py-4 mt-2 ml-4">
    <a href="https://deepart.com.tr/" >
   <h1 class="text-6xl uppercase tracking-[0.3em]">DEEPART</h1>

    </a>
</header>

<!-- Centered Container -->
<main class="flex flex-col items-center justify-center pb-10">

    <!-- Container for the header and description -->
   <div class="w-full max-w-56 text-left">
  <!-- Header -->
  <p class="text-xs font-bold text-black tracking-wider mb-0.5">${qr_name}</p>
  <!-- Description -->
  <p class="text-gray-800 text-xs mb-0">"${qr_not}"</p>
  <!-- Author -->
  <p class="text-gray-500 text-xs text-right mb-2"> - ${qr_author}</p>
</div>

    <!-- Video Section -->
     
<div class="relative">
  <video id="qrVideo" playsInline>
    <source src="https://${req.get("host")}/api/uploads/${qr_video}" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <div class="play-btn absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer">
    <i class="fa-solid fa-play text-white text-4xl"></i>
  </div>
</div>

<div id="redirectButtonContainer" class="flex flex-col justify-center items-center mt-5" style="display: none;">
  <button id="redirectButton" class="relative w-32 h-1 bg-transparent rounded-md overflow-hidden transition-all">
    <span id="progressFill" class="absolute inset-0 bg-red-600 h-1 w-0 transition-all"></span>
  </button>
  <a href="${qr_link}" id="redirectButtonText" class="tracking-widest mt-2 p-2 bg-white text-black rounded-md overflow-hidden hover:bg-black hover:text-white transition-all">
    Revolving...
  </a>
</div>

        

   </main>
<script>
 const video = document.getElementById("qrVideo");
const playBtn = document.querySelector(".play-btn");
const redirectButtonContainer = document.getElementById("redirectButtonContainer");
const redirectButton = document.getElementById("redirectButton");
const progressFill = document.getElementById("progressFill");

console.log("Script initialized");

// Hide play button when the video starts playing
playBtn.addEventListener("click", () => {
  console.log("Play button clicked");
  video.play();
  playBtn.style.display = "none";
 
  
});

// Show play button if the video is paused
video.addEventListener("pause", () => {
  console.log("Video paused");
   playBtn.style.display = "flex";
  
});

// Hide play button when the video resumes
video.addEventListener("play", () => {
  console.log("Video playing");
  playBtn.style.display = "none";
});

// Check video metadata is loaded
video.addEventListener("loadedmetadata", () => {
  console.log("Video loaded: duration = " + video.duration + " seconds");
});

// Monitor video playback
video.addEventListener("timeupdate", () => {
  const timeRemaining = video.duration - video.currentTime;
  console.log("Time remaining: " + timeRemaining.toFixed(2) + " seconds");

  // Show the button 5 seconds before video ends
  if (timeRemaining <= 8 && redirectButtonContainer.style.display === "none") {
    console.log("Displaying redirect button");
    redirectButtonContainer.style.display = "flex";
    redirectButtonContainer.style.animation = "fadeIn 1s ease-in-out";
  

    // Start a 5-second timer to fill the progress bar
    let progress = 0;
    const fillDuration = 5000; // 5 seconds
    const intervalTime = 50; // Update every 50 milliseconds (20 updates per second)
    const increment = 100 / (fillDuration / intervalTime); // Increment needed to fill 100% in 5 seconds

    const interval = setInterval(() => {
      progress += increment;
      progressFill.style.width = progress + "%";
      console.log("Progress: " + progress.toFixed(2) + "%");

      if (progress >= 100) {
        clearInterval(interval);
        redirectButton.disabled = false;
        console.log("Button enabled");
        window.location.href = "${qr_link}";	
      }
    }, intervalTime); // Update progress every 50 milliseconds
  }
});

// Handle video errors
video.addEventListener("error", (e) => {
  console.error("Error loading video", e);
});

// CSS Animations
const style = document.createElement("style");
style.textContent =
  "@keyframes fadeIn { " +
  "0% { opacity: 0; transform: scale(0.8); } " +
  "100% { opacity: 1; transform: scale(1); } " +
  "}"; 
document.head.appendChild(style);

</script>

  <script>
            tsParticles.load("tsparticles", {
                fpsLimit: 144,
                particles: {
                    number: {
                        value: 100,
                        density: {
                            enable: true,
                            value_area: 800,
                        },
                    },
                    color: {
                        value: "#000",
                    },
                    shape: {
                        type: "circle",
                    },
                    opacity: {
                        value: 0.5,
                        random: true,
                    },
                    size: {
                        value: 3,
                        random: true,
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        outMode: "bounce",
                    },
                },
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                    },
                    modes: {
                        repulse: {
                            distance: 100,
                            duration: 0.4,
                        },
                        push: {
                            particles_nb: 4,
                        },
                    },
                },
                detectRetina: true,
            });
        </script>

</body>
</html>
                `;

                    await fs.promises.writeFile(getAbsolutePath(qrPagePath), htmlContent);

                    res.status(200).json({ message: "QR code updated successfully." });
                } catch (err) {
                    console.error("Error regenerating HTML page:", err);
                    res.status(500).json({ error: "Failed to regenerate QR code page." });
                }
            });
        });
    });
};







// Add QR Code
export const QrAdd = (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ error: "Error uploading file." });

        const { qr_name, qr_link, qr_user, qr_not, qr_author } = req.body;
        const qr_video = req.file ? req.file.filename : null;

        if (!qr_name || !qr_link || !qr_user || !qr_not || !qr_author ) {
            return res.status(400).json({ error: "All fields are required." });
        }

        try {
            const qrIdentifier = `${Date.now()}_${qr_name}`;
            const qrPathUrl = `https://${req.get("host")}/qr/${qrIdentifier}`;
            const qrPngPath = `qr_codes/${qrIdentifier}.png`;
            const qrSvgPath = `qr_codes/${qrIdentifier}.svg`;
            const pagePath = `pages/${qrIdentifier}.html`;

            // Save to database
            const sql = `
                INSERT INTO qr_codes (qr_name, qr_link, qr_user, qr_video, qr_path, qr_png, qr_svg, qr_page_path, qr_not, qr_author)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(sql, [qr_name, qr_link, qr_user, qr_video, qrPathUrl, qrPngPath, qrSvgPath, pagePath, qr_not, qr_author], async (err, result) => {
                if (err) return res.status(500).json({ error: "Error saving QR code to database." });

                // Generate QR Code images
                await QRCode.toFile(getAbsolutePath(qrPngPath), qrPathUrl, { width: 300, errorCorrectionLevel: "H" });
                const qrSvgString = await QRCode.toString(qrPathUrl, { type: "svg", errorCorrectionLevel: "H" });
                await fs.promises.writeFile(getAbsolutePath(qrSvgPath), qrSvgString);
                const Logo = `https://${req.get("host")}/uploads/logo.PNG`; // Reference the server bg image
                const Favicon = `https://${req.get("host")}/api/uploads/icon.png`; // Reference the server bg image

                // Generate HTML Page
                const htmlContent = `
                  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" type="image/png" href="${Favicon}" />
    <title>${qr_name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script src="https://cdn.jsdelivr.net/npm/tsparticles@2.11.0"></script>
    <script>
  tailwind.config = {
    theme: {
      extend: {
        letterSpacing: {
          widest: "0.3em", // Correct syntax with unit
          wider: "0.2em", // Added unit
        },
        colors: {
          primary: "#8f8cee", // Example primary color
          secondary: "#8a1479", // Example secondary color
          accent: "#e0248b", // Example accent color
          textColor: "#e1e0fa", // Example custom gray
          backGround: "#070524",
        },
        fontWeight: {
          customBold: "500", // Corrected definition as an object
        },
        fontSize: {
        '6xl': ['244.3px', { lineHeight: '60px' }], // Custom font size to match dimensions
      },
    },
  };
</script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap');
        @import url('https://fonts.cdnfonts.com/css/gobold');
	@import url('https://fonts.cdnfonts.com/css/rakesly');
	p {
	font-family: 'Rakesly', sans-serif;
	
	}
        @font-face {
            src: url("https://www.axis-praxis.org/fonts/webfonts/MetaVariableDemo-Set.woff2")
            format("woff2");
            font-family: "Meta";
            font-style: normal;
            font-weight: normal;
        }
        h1{
           font-family: 'Gobold High Bold', sans-serif; 
        }

        body {
            font-family: 'Gobold', sans-serif;
           
            background-color: white; 
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            margin: 0;
        }
        #tsparticles {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
       
       .cussstom_font {
            font-family: "Gobold Thin Light", sans-serif;
        }
       video {
     
         width: 244.3px;
  height: 507.1px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 20px;
  border-color: #000;
  border: 2px solid #000;
            
       } 
       .play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  color: #fff;
  font-size: 50px;
  width: 80px;
  height: 80px;
  z-index: 2;
  border-radius: 50%;
  position: relative;
}
.play-btn:before {
  content: '';
  position: absolute;
  border: 15px solid #fff;
  border-radius: 50%;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  animation: bloom1 1.5s linear infinite;
  opacity: 0;
  z-index: 1;
}
.play{
    width: 25px;
    height:auto;

}

.play-btn:after {
  content: '';
  position: absolute;
  border: 15px solid #fff;
  border-radius: 50%;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  animation: bloom2 1.5s linear infinite;
  opacity: 0;
  animation-delay: 0.4s;
  z-index: 1;
}
.play-btn:hover{
    cursor: pointer;
}

@keyframes bloom1 {
  0% {
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
  }
}

@keyframes bloom2 {
  0% {
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
  }
}



    </style>
</head>
<body>

<!-- Header -->
<header class="text-center py-4 mt-2 ml-4">
    <a href="https://deepart.com.tr/" >
   <h1 class="text-6xl uppercase tracking-[0.3em]">DEEPART</h1>

    </a>
</header>

<!-- Centered Container -->
<main class="flex flex-col items-center justify-center pb-10">

    <!-- Container for the header and description -->
   <div class="w-full max-w-56 text-left">
  <!-- Header -->
  <p class="text-xs font-bold text-black tracking-wider mb-0.5">${qr_name}</p>
  <!-- Description -->
  <p class="text-gray-800 text-xs mb-0">"${qr_not}"</p>
  <!-- Author -->
  <p class="text-gray-500 text-xs text-right mb-2"> - ${qr_author}</p>
</div>

    <!-- Video Section -->
     
<div class="relative">
  <video id="qrVideo" playsInline>
    <source src="https://${req.get("host")}/api/uploads/${qr_video}" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <div class="play-btn absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer">
    <i class="fa-solid fa-play text-white text-4xl"></i>
  </div>
</div>

<div id="redirectButtonContainer" class="flex flex-col justify-center items-center mt-5" style="display: none;">
  <button id="redirectButton" class="relative w-32 h-1 bg-transparent rounded-md overflow-hidden transition-all">
    <span id="progressFill" class="absolute inset-0 bg-red-600 h-1 w-0 transition-all"></span>
  </button>
  <a href="${qr_link}" id="redirectButtonText" class="tracking-widest mt-2 p-2 bg-white text-black rounded-md overflow-hidden hover:bg-black hover:text-white transition-all">
    Revolving...
  </a>
</div>

        

   </main>
<script>
 const video = document.getElementById("qrVideo");
const playBtn = document.querySelector(".play-btn");
const redirectButtonContainer = document.getElementById("redirectButtonContainer");
const redirectButton = document.getElementById("redirectButton");
const progressFill = document.getElementById("progressFill");

console.log("Script initialized");

// Hide play button when the video starts playing
playBtn.addEventListener("click", () => {
  console.log("Play button clicked");
  video.play();
  playBtn.style.display = "none";
 
  
});

// Show play button if the video is paused
video.addEventListener("pause", () => {
  console.log("Video paused");
   playBtn.style.display = "flex";
  
});

// Hide play button when the video resumes
video.addEventListener("play", () => {
  console.log("Video playing");
  playBtn.style.display = "none";
});

// Check video metadata is loaded
video.addEventListener("loadedmetadata", () => {
  console.log("Video loaded: duration = " + video.duration + " seconds");
});

// Monitor video playback
video.addEventListener("timeupdate", () => {
  const timeRemaining = video.duration - video.currentTime;
  console.log("Time remaining: " + timeRemaining.toFixed(2) + " seconds");

  // Show the button 5 seconds before video ends
  if (timeRemaining <= 8 && redirectButtonContainer.style.display === "none") {
    console.log("Displaying redirect button");
    redirectButtonContainer.style.display = "flex";
    redirectButtonContainer.style.animation = "fadeIn 1s ease-in-out";
  

    // Start a 5-second timer to fill the progress bar
    let progress = 0;
    const fillDuration = 5000; // 5 seconds
    const intervalTime = 50; // Update every 50 milliseconds (20 updates per second)
    const increment = 100 / (fillDuration / intervalTime); // Increment needed to fill 100% in 5 seconds

    const interval = setInterval(() => {
      progress += increment;
      progressFill.style.width = progress + "%";
      console.log("Progress: " + progress.toFixed(2) + "%");

      if (progress >= 100) {
        clearInterval(interval);
        redirectButton.disabled = false;
        console.log("Button enabled");
        window.location.href = "${qr_link}";	
      }
    }, intervalTime); // Update progress every 50 milliseconds
  }
});

// Handle video errors
video.addEventListener("error", (e) => {
  console.error("Error loading video", e);
});

// CSS Animations
const style = document.createElement("style");
style.textContent =
  "@keyframes fadeIn { " +
  "0% { opacity: 0; transform: scale(0.8); } " +
  "100% { opacity: 1; transform: scale(1); } " +
  "}"; 
document.head.appendChild(style);

</script>

  <script>
            tsParticles.load("tsparticles", {
                fpsLimit: 144,
                particles: {
                    number: {
                        value: 100,
                        density: {
                            enable: true,
                            value_area: 800,
                        },
                    },
                    color: {
                        value: "#000",
                    },
                    shape: {
                        type: "circle",
                    },
                    opacity: {
                        value: 0.5,
                        random: true,
                    },
                    size: {
                        value: 3,
                        random: true,
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        outMode: "bounce",
                    },
                },
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                    },
                    modes: {
                        repulse: {
                            distance: 100,
                            duration: 0.4,
                        },
                        push: {
                            particles_nb: 4,
                        },
                    },
                },
                detectRetina: true,
            });
        </script>

</body>
</html>
                `;
                await fs.promises.writeFile(getAbsolutePath(pagePath), htmlContent);

                return res.status(201).json({
                    status: "success",
                    message: "QR Code added successfully.",
                    qr_id: result.insertId,
                    qrPngPath: `https://${req.get("host")}/api/uploads/${qrPngPath}`,
                    qrSvgPath: `https://${req.get("host")}/api/uploads/${qrSvgPath}`,
                    qrPagePath: `https://${req.get("host")}/qr/${qrIdentifier}`,
                });
            });
        } catch (err) {
            return res.status(500).json({ error: "Error processing QR Code." });
        }
    });
};
export const serveDynamicQRContent = (req, res) => {
    const { identifier } = req.params;
    const pageFilePath = getAbsolutePath(`pages/${identifier}.html`);
    if (fs.existsSync(pageFilePath)) {
        res.sendFile(pageFilePath);
    } else {
        res.status(404).json({ error: "Page not found." });
    }
};

export const getAllQRCodes = (req, res) => {
    const { id } = req.params;

    // If an ID is provided, fetch only that QR code
    let query = `
        SELECT qr.id, qr.qr_name, qr.qr_link, qr.qr_path, qr.qr_user, qr.qr_video, qr.qr_png, qr.qr_svg, qr.qr_not, qr.qr_author, u.name AS user_name
        FROM qr_codes qr
        LEFT JOIN users u ON qr.qr_user = u.id
    `;

    // If an ID is specified, modify the query to get the specific QR code
    if (id) {
        query += ` WHERE qr.id = ?`;
    }

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch QR code(s)." });

        // If no results are found for the given ID, send a 404 response
        if (id && results.length === 0) {
            return res.status(404).json({ error: "QR code not found." });
        }

        res.status(200).json(results);
    });
};

export const deleteQR = (req, res) => {
    const qrId = req.params.id;

    const query = "SELECT qr_video, qr_page_path, qr_png, qr_svg FROM qr_codes WHERE id = ?";
    db.query(query, [qrId], (err, results) => {
        if (err) return res.status(500).json({ error: "Error fetching QR code." });
        if (!results.length) return res.status(404).json({ error: "QR code not found." });

        const { qr_video, qr_page_path, qr_png, qr_svg } = results[0];

        const deleteFile = (filePath) => {
            if (!filePath) return;
            const relativePath = filePath.split("/uploads/")[1] || filePath;
            const absolutePath = getAbsolutePath(relativePath);
            fs.unlink(absolutePath, (unlinkErr) => {
                if (unlinkErr && unlinkErr.code !== "ENOENT") {
                    console.error(`Failed to delete file: ${absolutePath}`, unlinkErr);
                }
            });
        };

        db.query("DELETE FROM qr_codes WHERE id = ?", [qrId], (deleteErr) => {
            if (deleteErr) return res.status(500).json({ error: "Error deleting QR code." });

            // Delete video, path, PNG, and svg files
            deleteFile(qr_video);
            deleteFile(qr_page_path);
            deleteFile(qr_png);
            deleteFile(qr_svg);

            res.status(200).json({ status: "success", message: "QR code deleted successfully." });
        });
    });
};


export const downloadQRCode = (req, res) => {
    const { qrId, type } = req.params;

    if (!["png", "svg"].includes(type)) {
        return res.status(400).json({ error: "Invalid file type. Only 'png' and 'svg' are supported." });
    }

    const sql = `
        SELECT qr_png, qr_svg
        FROM qr_codes
        WHERE id = ?
    `;
    db.query(sql, [qrId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database query error." });
        if (results.length === 0) return res.status(404).json({ error: "QR Code not found." });

        const filePath = type === "png" ? results[0].qr_png : results[0].qr_svg;

        // Use the correct base directory
        const baseDirectory = path.join(__dirname, "..", "uploads"); // Adjust "uploads" to your actual folder name
        const absolutePath = path.join(baseDirectory, filePath);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ error: "File not found." });
        }

        return res.download(absolutePath, `${path.basename(filePath)}`, (err) => {
            if (err) {
                return res.status(500).json({ error: "Error downloading the file." });
            }
        });
    });
};

