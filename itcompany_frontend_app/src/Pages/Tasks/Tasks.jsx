import "./Tasks.css";

const Tasks=()=>{
    return(
    <div class="container mt-4">
    <h1 class="mb-4">Tasks</h1>

    <div class="btn-group mb-4" role="group">
      <button type="button" class="btn btn-outline-primary">All</button>
      <button type="button" class="btn btn-outline-primary">Obligatory</button>
      <button type="button" class="btn btn-outline-primary">Optional</button>
      <button type="button" class="btn btn-outline-primary">In review</button>
      <button type="button" class="btn btn-outline-primary">Done</button>
    </div>

    <h2 class="task-type-h2">Obligatory tasks</h2>

    <div class="row justify-content">

      <div class="adaptive-div">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Task Title</h5>
            <img src="https://www.shutterstock.com/shutterstock/photos/2060448152/display_1500/stock-vector-sustainable-development-concept-brochure-cover-page-design-concept-for-corporate-social-2060448152.jpg" class="card-img-top" width="300px" height="300px" alt="Task Image" />
            <div class="divWithButtons">
                <a href="#" class="btn btn-primary">Details</a>
                <a href="#" class="btn btn-success">Upload</a>
            </div>
          </div>
        </div>
      </div>
      
    </div>

    <h2 class="task-type-h2">Optional tasks</h2>

    <div class="row justify-content">

      <div class="adaptive-div">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Task Title</h5>
            <img src="https://www.shutterstock.com/shutterstock/photos/2060448152/display_1500/stock-vector-sustainable-development-concept-brochure-cover-page-design-concept-for-corporate-social-2060448152.jpg" class="card-img-top" width="300px" height="300px" alt="Task Image" />
            <a href="#" class="btn btn-warning mt-3">Claim</a>
          </div>
        </div>
      </div>

    </div>

    <h2 class="task-type-h2">In review</h2>

    <div class="row justify-content">

      <div class="adaptive-div">
        <div class="card bg-warning bg-gradient">
          <div class="card-body">
            <h5 class="card-title">Task Title</h5>
            <img src="https://www.shutterstock.com/shutterstock/photos/2060448152/display_1500/stock-vector-sustainable-development-concept-brochure-cover-page-design-concept-for-corporate-social-2060448152.jpg" class="card-img-top" width="300px" height="300px" alt="Task Image" />
            <h6 class="mt-3">Uploaded: 23.04.2024</h6>
          </div>
        </div>
      </div>
      
    </div>

    <h2 class="task-type-h2">Done</h2>

    <div class="row justify-content">

      <div class="adaptive-div">
        <div class="card" style={{backgroundColor: "lightgreen"}}>
          <div class="card-body" style={{position: "relative"}}>
            <h5 class="card-title">Task Title</h5>
            <img src="https://www.shutterstock.com/shutterstock/photos/2060448152/display_1500/stock-vector-sustainable-development-concept-brochure-cover-page-design-concept-for-corporate-social-2060448152.jpg" class="card-img-top" width="300px" height="300px" alt="Task Image" />
            <h6 class="mt-3">Uploaded: 23.04.2024</h6>

            <div class="done-div">
              <span>+ 15$</span>
            </div>

          </div>
        </div>
      </div>
      
    </div>

  </div>
    )
};

export{Tasks};