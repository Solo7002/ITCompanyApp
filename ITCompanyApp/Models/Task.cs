using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models
{
    public class Task
    {
        public int TaskId { get; set; }
        public int? ProjectId { get; set; }
        public virtual Project Project { get; set; }
        public int? EmployeeFor_Id { get; set; }
        public virtual Employee EmployeeFor { get; set; }
        public int? EmployeeFrom_Id { get; set; }
        public virtual Employee EmployeeFrom { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd.MM.yyyy}")]
        public DateTime UploadDate { get; set; }
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
        public string DoneFile { get; set; }
        public string Cover { get; set; }
        public bool IsDone { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd.MM.yyyy}")]
        public DateTime? DoneDate { get; set; }
    }
}
