using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models.ViewModels
{
    public class AccessLevelViewModel
    {
        public string AccessLevelName { get; set; }
        [Range(1, 10, ErrorMessage = "From 1 to 10")]
        [Required(ErrorMessage = "The field must be filled")]
        public int AccessLevelMark { get; set; }
    }
}
