import {useParams , useNavigate } from 'react';

function DeleteExtra() {
    const {id} = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this extra");
        if(!confirmDelete) return;

        try {
            const response = await fetch(`/api/extras/${id}` , {
                method:'DELETE'
            });

            if(response.ok) {
                alert('Extra deleted successfully!');
                navigate('/');
            }
            else{
                alert('Failed to delete extra.');
            }

        }
        catch(error){
            console.error(error);
            alert('Error deleting extra. ');
        }
    };

    return (
        <div>
            <h1>Delete Extra</h1>
            <button onClick={handleDelete}>
                Confirm Delete
            </button>
        </div>
    );
}

export default DeleteExtra;