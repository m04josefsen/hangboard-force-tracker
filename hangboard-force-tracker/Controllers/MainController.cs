using Microsoft.AspNetCore.Mvc;
using hangboard_force_tracker.Models;

namespace hangboard_force_tracker
{
    [ApiController]
    public class MainController : ControllerBase
    {
        private static readonly List<ForceData> dataBuffer = new List<ForceData>();
        private static readonly object lockObj = new object();
        private static double currentTime = 0;

        // Simulation / ESP32 sends data
        [HttpPost("data")]
        public IActionResult ReceiveData([FromBody] Dictionary<string, object> payload)
        {
            // If any value is missing
            if (payload == null || !payload.ContainsKey("value"))
                return BadRequest(new { status = "missing value" });

            // If parsing goes correct, add value to variable
            if (!double.TryParse(payload["value"].ToString(), out double value))
                return BadRequest(new { status = "invalid value" });

            lock (lockObj)
            {
                dataBuffer.Add(new ForceData { force = value, time = currentTime });
                currentTime += 0.25;
            }

            return Ok(new { status = "ok" });
        }

        // Fetched from Frontend
        [HttpGet("latest")]
        public IActionResult GetLatestData()
        {
            lock (lockObj)
            {
                return Ok(dataBuffer);
            }
        }

        // Empties Data buffer from Frontend
        [HttpDelete("deleteData")]
        public IActionResult DeleteData()
        {
            currentTime = 0;
            dataBuffer.Clear();
            return NoContent();
        }
    }
}