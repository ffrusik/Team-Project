/*code to add an extra */
import {  useState} from 'react';
import {useNavigate} from 'react-router-dom';

function AddExtra() {

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
        
        alert(' Backend not ready guys.');
        console.log(extra);
        navigate('/admin/dashboard');
        

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
        <main className="page-container">
            <div className="form-wrapper">
                <h1>Add Extra</h1>

                <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input 
                     type="text"
                     name="name"
                     value={extra.name}
                     onChange={handleChange}
                     required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input 
                     type="text"
                     name="description"
                     value={extra.description}
                     onChange={handleChange}
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
                     required
                    />
        </div>

        <button type="submit">Add Extra</button>
    </form>
    </div>
        </main>
    );
}

export default AddExtra;
    