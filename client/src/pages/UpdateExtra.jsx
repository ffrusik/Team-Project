/*code to update price,name, or amount of extra */
import {useEffect, useState} from 'react';
import { useParams, useNavigate} from 'react-router-dom';

function UpdateExtra(){
    const { id } = useParams();
    const navigate = useNavigate();

    const [extra, setExtra] = useState({
        name: '',
        price: ''
    });

    useEffect(() => {
        fetch('/api/extra/${id}')
        .then(res => res.json())
        .then(data => setExtra(data))
        .catch(err => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        setExtra({
            ...extra,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('/api/extra/${id}', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(extra)
        })
        .then(res =>{
            if(res.ok) {
                alert('Extra updated successfully!');
                navigate('/');
            }   else {
                alert('Failed to update extra.');
            }
        }) 
        .catch(err => {
            console.error(err);
            alert('Error updating extra.');
        });

        };

        return (
            <div>
                <h1>Update an Extra</h1>  
                <form onSubmit={handleSubumit}>
                    <label>Name:</label>
                    <input 
                     type="text"
                     name="name"
                     value={extra.name}
                     onChange={handleChange}
                     required
                    />
                    <label>Price:</label>
                    <input
                        type="text"
                        name="name"
                        value={extra.name}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Update Extra</button>
                    </form>        
            
            </div>
            
        );

}

export default UpdateExtra;