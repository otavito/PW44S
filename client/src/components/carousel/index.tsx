export default function App() {
    return (
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
            {/* Indicadores */}
            <div className="carousel-indicators">
                <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="0"
                    className="active"
                    aria-current="true"
                    aria-label="Slide 1"
                ></button>
                <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"
                ></button>
                <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="2"
                    aria-label="Slide 3"
                ></button>
            </div>

            {/* Slides */}
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="/img/fraisier.png" className="d-block w-100" alt="Ceramic collection" style={{ maxHeight: "400px", objectFit: "cover" }}/>
                </div>
                <div className="carousel-item">
                    <img src="/img/tarte.png" className="d-block w-100" alt="Ceramic Wheel Forming" style={{ maxHeight: "400px", objectFit: "cover" }}/>
                </div>
                <div className="carousel-item">
                    <img src="/img/eclair.png" className="d-block w-100" alt="Ceramic pots with glaze" style={{ maxHeight: "400px", objectFit: "cover" }}/>
                </div>
            </div>

            {/* Controles */}
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}
