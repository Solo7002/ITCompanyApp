using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models.ViewModels
{
    public class TaskViewModel
    {
        [Required(ErrorMessage = "The field must be filled")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd.MM.yyyy}")]
        public DateTime DeadLineDate { get; set; }

        [StringLength(100, ErrorMessage = "To 100 characters")]
        [Required(ErrorMessage = "The field must be filled")]
        public string Header { get; set; }

        [StringLength(500, ErrorMessage = "To 500 characters")]
        public string Text { get; set; }
        public string File { get; set; }
        public string? DoneFile { get; set; }
        public string Cover { get; set; }
        public bool IsDone { get; set; }
        public int? ProjectId { get; set; }
        public int? EmployeeFor_Id { get; set; }
        public int? EmployeeFrom_Id { get; set; }
    }
}
