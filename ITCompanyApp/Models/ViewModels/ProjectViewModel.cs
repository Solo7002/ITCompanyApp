﻿using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models.ViewModels
{
    public class ProjectViewModel
    {
        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "From 2 to 50 characters")]
        public string ProjectName { get; set; }
        [StringLength(500, ErrorMessage = "To 500 characters")]
        public string Description { get; set; }
        public string File { get; set; }
        public bool IsDone { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd.MM.yyyy}")]
        public DateTime StartProjectDate { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd.MM.yyyy}")]
        public DateTime DeadLineProjectDate { get; set; }
        public int? EmployeeId { get; set; }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            var other = (ProjectViewModel)obj;
            return ProjectName == other.ProjectName &&
                   Description == other.Description &&
                   File == other.File &&
                   IsDone == other.IsDone &&
                   StartProjectDate == other.StartProjectDate &&
                   DeadLineProjectDate == other.DeadLineProjectDate &&
                   EmployeeId == other.EmployeeId;
        }
        public override int GetHashCode()
        {
            return HashCode.Combine(ProjectName, Description, File, IsDone, StartProjectDate, DeadLineProjectDate, EmployeeId);
        }
    }
}
