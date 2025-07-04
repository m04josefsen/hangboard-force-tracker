using Microsoft.AspNetCore.Mvc;
using hangboard_force_tracker.Models;

namespace hangboard_force_tracker
{
    [ApiController]
    public class MainController : ControllerBase
    {
        private static readonly List<ForceData> dataBuffer = new List<ForceData>();
        private static readonly object lockObj = new object();
        private const int MaxDataPoints = 100;

        // Simulation / ESP32 sends data
        [HttpPost("data")]
        public IActionResult ReceiveData([FromBody] Dictionary<string, object> payload)
        {
            // If any value is missing
            if (payload == null || !payload.ContainsKey("value") || !payload.ContainsKey("time"))
                return BadRequest(new { status = "missing value" });

            // If parsing goes correct, add value to variable
            if (!double.TryParse(payload["value"].ToString(), out double value))
                return BadRequest(new { status = "invalid value" });

            if (!double.TryParse(payload["time"].ToString(), out double time))
            {
                return BadRequest(new { status = "invalid time" });
            }

            lock (lockObj)
            {
                dataBuffer.Add(new ForceData { force = value, time = time });

                if (dataBuffer.Count > MaxDataPoints)
                    dataBuffer.RemoveAt(0);
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
            dataBuffer.Clear();
            return NoContent();
        }
    }
}