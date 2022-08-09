using System.ComponentModel.DataAnnotations;

namespace Concessionaire.WebAPI.ValidationAttributes
{
    public class AllowedExtensionsAttribute : ValidationAttribute
    {
        private readonly string[] _extensions;
        public AllowedExtensionsAttribute(string[] extensions)
        {
            _extensions = extensions;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is IFormFile file)
            {
                var extension = Path.GetExtension(file.FileName);
                if (!_extensions.Contains(extension.ToLower()))
                {
                    return new ValidationResult(GetErrorMessage(extension));
                }
            }

            return ValidationResult.Success;
        }

        public string GetErrorMessage(string extension)
        {
            return $"{extension} extension is not allowed";
        }
    }
}
