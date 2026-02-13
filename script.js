document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const button = form.querySelector("button");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const singer = form.querySelector('input[name="singer"]').value.trim();
    const videos = parseInt(form.querySelector('input[name="videos"]').value);
    const duration = parseInt(
      form.querySelector('input[name="duration"]').value,
    );
    const email = form.querySelector('input[name="email"]').value.trim();

    if (!singer) {
      alert("Please enter singer name.");
      return;
    }

    if (isNaN(videos) || videos < 10) {
      alert("Number of videos must be 10 or more.");
      return;
    }

    if (isNaN(duration) || duration < 20) {
      alert("Duration must be 20 seconds or more.");
      return;
    }

    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    button.disabled = true;
    button.innerText = "Processing...";

    async function checkStatus(jobId) {
      const res = await fetch(`/status/${jobId}`);
      const data = await res.json();
      return data.status;
    }

    try {
      const response = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ singer, videos, duration, email }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const result = await response.json();
      const jobId = result.job_id;

      const interval = setInterval(async () => {
        const status = await checkStatus(jobId);

        if (status === "done") {
          clearInterval(interval);
          alert("Mashup email sent successfully!");
          button.disabled = false;
          button.innerText = "Get Mashup";
        }
      }, 5000);
    } catch (error) {
      alert("Something went wrong. Please try again.");
      button.disabled = false;
      button.innerText = "Get Mashup";
      console.error(error);
    }
  });
});
