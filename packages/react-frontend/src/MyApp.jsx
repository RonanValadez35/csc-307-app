// src/MyApp.jsx
import React, { useState, useEffect } from 'react';
import Table from "./Table";
import Form from "./Form";



function MyApp() {
    const [characters, setCharacters] = useState([]);

    function updateList(person) {
        postUser(person)
            .then((res) => res.json())                 
            .then((created) => setCharacters((prev) => [...prev, created]))
            .catch((error) => {
                console.log(error);
            })
    }



    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
    }, []);

    function postUser(person) {
        const promise = fetch("Http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }
                return res.json();
            });
    }

    function removeOneCharacter(index) {
        const userToDelete = characters[index];
        if (!userToDelete || !userToDelete._id) {
            console.error("Cannot delete user: no ID found");
            return;
        }

        fetch(`http://localhost:8000/users/${userToDelete._id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Delete failed with status ${res.status}`);
                }
                // Successfully deleted from backend, now update frontend
                setCharacters((prevCharacters) => 
                    prevCharacters.filter((character, i) => i !== index)
                );
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
            });
    }
    return (
        <div className="container">
            <Table
                characterData={characters}
                removeCharacter={removeOneCharacter}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}
export default MyApp;