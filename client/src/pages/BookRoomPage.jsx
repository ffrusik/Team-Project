import { useParams } from "react-router-dom";

function BookRoomPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Book Room {id}</h1>
      {/* booking form here */}
    </div>
  );
}

export default BookRoomPage;