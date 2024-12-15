// src/useLocalStorage.js
import { useState } from "react";

export function useLocalStorage(key, initialValue) {
    const storedValue = localStorage.getItem(key);
    const [value, setValue] = useState(storedValue ? JSON.parse(storedValue) : initialValue);

    const setLocalStorageValue = (newValue) => {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
    };

    return [value, setLocalStorageValue];
}
