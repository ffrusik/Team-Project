/*code to add an extra */
import { useEffect, useState} from 'react';
import {useNavigate} from 'react';

function AddExtra(){

    const navigate = useNavigate();

    const [extra, setExtra] = useState({
        name: '',
        description: '',
        price: '',
    });

    const handleChange = (e) => {
        setExtra({
            ...extra,
            [e.target.name]:e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('/api/extras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(extra)
        })
        .then(res => {
            if(res.ok) {
                alert('Extra added successfully!');
                navigate('/');
            }   else {
                alert('Failed to add extra.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error adding extra.');
        });
    };

    return (
        <div>
            <h1>Add Extra</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input 
                     type="text"
                     name="name"
                     value={extra.name}
                     onChange={handleChange}
                     placeholder="Cup of Tea"
                     required
                    />
                </div>

                <div>
                    <label>Price (€):</label>
                    <input
                     type="number"
                     name="price"
                     value={extra.price}
                     onChange={handleChange}
                     placeholder="5"
                     required
                    />
        </div>

        <button type="submit">Add Extra</button>
    </form>
    </div>
    );
}

export default AddExtra;
    