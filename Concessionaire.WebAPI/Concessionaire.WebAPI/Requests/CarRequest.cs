using Concessionaire.WebAPI.ValidationAttributes;
using System.ComponentModel.DataAnnotations;

namespace Concessionaire.WebAPI.Requests
{
    public class CarRequest
    {
        [Required]
        public string Brand { get; set; }
        [Required]
        public string Model { get; set; }
        [Required]
        public int Year { get; set; }

        [MaxFileSize(1 * 1024 * 1024)]
        [AllowedExtensions(new string[] { ".jpg", ".jpeg", ".png" })]
        public IFormFile Image { get; set; }

        [MaxFileSize(4 * 1024 * 1024)]
        [AllowedExtensions(new string[] { ".pdf" })]
        public IFormFile TechnicalDataSheet { get; set; }
    }
}
