import "./App.scss";
import Grid from "./ui/Grid";

function App() {
  return (
    <div className="App">
      <header>
        <div className="container">
          <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
            <a
              href="/"
              className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
            >
              <span className="fs-4">Simulation</span>
            </a>
          </header>
        </div>
      </header>

      <main role="main">
        <div className="container">
          <div className="row">
            <div className="col-6">ddddddddd</div>
            <div className="col-6"></div>
          </div>
          <div className="row">
            <div className="col-12 ">
              <Grid n={50}></Grid>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
