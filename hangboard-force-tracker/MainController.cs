using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace hangboard_force_tracker
{
    [ApiController]
    public class MainController : ControllerBase
    {
        private static readonly List<object> dataBuffer = new List<object>();
        private static readonly object lockObj = new object();
        private const int MaxDataPoints = 100;

        [HttpPost("data")]
        public IActionResult ReceiveData([FromBody] Dictionary<string, object> payload)
        {
            if (payload == null || !payload.ContainsKey("value"))
                return BadRequest(new { status = "missing value" });

            if (!double.TryParse(payload["value"].ToString(), out double value))
                return BadRequest(new { status = "invalid value" });

            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            lock (lockObj)
            {
                dataBuffer.Add(new { t = timestamp, y = value });

                if (dataBuffer.Count > MaxDataPoints)
                    dataBuffer.RemoveAt(0);
            }

            return Ok(new { status = "ok" });
        }

        [HttpGet("latest")]
        public IActionResult GetLatestData()
        {
            lock (lockObj)
            {
                return Ok(dataBuffer);
            }
        }
    }
}