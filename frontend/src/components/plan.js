import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled, { keyframes } from 'styled-components';
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const DEFAULT_ROWS = 5;
const STORAGE_KEY = 'planData';

const downloadTableAsImage = (tableId) => {
    const userConfirmed = window.confirm("Are you sure you want to download the training plan?");
    if (!userConfirmed) {
        return;  // if the user cancels, do nothing
    }
    const table = document.getElementById(tableId);

    html2canvas(table).then(canvas => {
        const imgURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgURL;
        link.download = 'training-plan.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

const validatePlanData = (data) => {
    const keys = Object.keys(data);
    const cleanedData = [];
    let isValid = true;
    let errorMessage = '';
    const numFileds = 5;
    for (let i = 0; i < keys.length / numFileds; i++) {
        let isRowPartiallyFilled = false;
        let isRowCompletelyEmpty = true;
        let row = {};

        for (let j = 0; j < numFileds; j++) {
            const key = keys[i * numFileds + j];
            const value = data[key];

            if (value.trim() !== "") {
                row[key] = value;
                isRowPartiallyFilled = true;
                isRowCompletelyEmpty = false;
            }
        }

        if (isRowPartiallyFilled) {
            let isRowValid = true;
            for (let j = 0; j < numFileds; j++) {
                const key = keys[i * numFileds + j];
                if (row[key] === undefined || row[key].trim() === "") {
                    isValid = false;
                    isRowValid = false;
                    errorMessage = `Line ${i + 1} is not complete. Please fill in all fields.`;
                    break;
                }
            }

            if (isRowValid) {
                console.log(row);
                // clean the row
                const keyRegEx = /_(\d+)/;// regx to match _number
                let newRow = {};
                Object.keys(row).forEach(key => {
                    const newKey = key.replace(keyRegEx, '');
                    newRow[newKey] = row[key];
                })
                // add row to cleanedData array
                cleanedData.push(newRow);
            }
        }
    }

    return { valid: isValid, message: errorMessage, data: cleanedData };
}


const Plan = ({ muscle, clickCount }) => {
    const { register, handleSubmit, setValue, getValues, watch } = useForm();
    const [currentRows, setCurrentRows] = useState(DEFAULT_ROWS);
    const allFieldValues = watch();  // watch will return a form object and we can get values from here
    const [dateValue, setDateValue] = useState(new Date());


    //initialize table
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData) {
            const parsedData = JSON.parse(savedData);

            // Update currentRows based on the stored data
            const rowsFromStorage = Object.keys(parsedData).length / 5; // 5 is the number of fields per row
            setCurrentRows(rowsFromStorage);

            Object.entries(parsedData).forEach(([key, value]) => {
                setValue(key, value);
            });
        } else {
            // If there's no data in sessionStorage, set default values
            for (let i = 0; i < DEFAULT_ROWS; i++) {
                setValue(`muscle_${i}`, "");
                setValue(`exercise_${i}`, "");
                setValue(`repetitions_${i}`, "");
                setValue(`sets_${i}`, "");
                setValue(`maximum_${i}`, "");
            }
        }
    }, [setValue]);


    // helper function to check whether a new row should be added
    const shouldAddRow = () => {
        for (let i = 0; i < currentRows; i++) {
            if (!getValues(`muscle_${i}`)) {
                return false;
            }
        }
        return true;
    };

    // observe the data changes in all the fileds and detect whether there's a need to add a new row  
    useEffect(() => {
        if (shouldAddRow()) {
            setCurrentRows(prevRows => prevRows + 1);
        }
    }, [allFieldValues]);


    useEffect(() => {
        if (muscle) { // when a muscle is selected and the prop changes
            let rowToFill = -1;

            // check whether there's totally blank row in the current table 
            for (let i = 0; i < currentRows; i++) {
                if (!getValues(`muscle_${i}`)) {
                    rowToFill = i; // record the first empty row
                    break;
                }
            }

            // if there is a one empty row, add the muscle to it
            if (rowToFill !== -1) {
                setValue(`muscle_${rowToFill}`, muscle);
            }
            // no empty row, add a new row
            else {
                setValue(`muscle_${currentRows}`, muscle);
            }
        }
    }, [muscle, clickCount,]);



    const onSubmit = async (data) => {
        // save locally first
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

        // validate data
        const cleanedData = validatePlanData(data);
        let combinedData = {};
        if (!cleanedData.valid) alert("Invalid data: " + cleanedData.message);
        else {
            // combine data from form with calendar date, uid
            // combine data
            combinedData = {
                uid: 5,
                // uid is just for test
                date: dateValue,
                data: cleanedData.data
            }
        }
        // submit data to server
        try {
            const response = await fetch('http://localhost:5001/home', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // JSON.stringify(combinedData) to serialize the combinedData object to a JSON-formatted string that can be transmitted over the HTTP request.
                body: JSON.stringify(combinedData)
            });
            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.log('error during fetch in submit training data', error);
        }

    };

    const deleteRow = (indexToDelete) => {
        // 1. get all the data from localStorage
        const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

        // 2. move all the data one row up
        for (let i = indexToDelete + 1; i < currentRows; i++) {
            const muscleValue = getValues(`muscle_${i}`);
            const exerciseValue = getValues(`exercise_${i}`);
            const repetitionsValue = getValues(`repetitions_${i}`);
            const setsValue = getValues(`sets_${i}`);
            const maximumValue = getValues(`maximum_${i}`);

            setValue(`muscle_${i - 1}`, muscleValue);
            setValue(`exercise_${i - 1}`, exerciseValue);
            setValue(`repetitions_${i - 1}`, repetitionsValue);
            setValue(`sets_${i - 1}`, setsValue);
            setValue(`maximum_${i - 1}`, maximumValue);

            savedData[`muscle_${i - 1}`] = muscleValue;
            savedData[`exercise_${i - 1}`] = exerciseValue;
            savedData[`repetitions_${i - 1}`] = repetitionsValue;
            savedData[`sets_${i - 1}`] = setsValue;
            savedData[`maximum_${i - 1}`] = maximumValue;
        }

        // 4. delete the last row
        setValue(`muscle_${currentRows - 1}`, "");
        setValue(`exercise_${currentRows - 1}`, "");
        setValue(`repetitions_${currentRows - 1}`, "");
        setValue(`sets_${currentRows - 1}`, "");
        setValue(`maximum_${currentRows - 1}`, "");

        delete savedData[`muscle_${currentRows - 1}`];
        delete savedData[`exercise_${currentRows - 1}`];
        delete savedData[`repetitions_${currentRows - 1}`];
        delete savedData[`sets_${currentRows - 1}`];
        delete savedData[`maximum_${currentRows - 1}`];

        // 5. update the localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

        // 6. redcue the number of rows by 1
        setCurrentRows(prevRows => prevRows - 1);
    }


    const clearRows = () => {
        for (let i = 0; i < currentRows; i++) {
            setValue(`muscle_${i}`, "");
            setValue(`exercise_${i}`, "");
            setValue(`repetitions_${i}`, "");
            setValue(`sets_${i}`, "");
            setValue(`maximum_${i}`, "");
        }
        setCurrentRows(DEFAULT_ROWS);
        localStorage.removeItem(STORAGE_KEY);
    }


    return (
        <StyledPlan>
            <StyledTitle>Plan</StyledTitle>
            <CalendarContainer>
                <DatePicker
                    showIcon
                    selected={dateValue}
                    onChange={(date) => setDateValue(date)}
                    dateFormat="yyyy-MM-dd"
                    // minDate={new Date()}
                />
            </CalendarContainer>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <StyledTableContainer>
                    <StyledTable id="planTable">
                        <thead>
                            <StyledTr>
                                <StyledTh>Muscle</StyledTh>
                                <StyledTh>Exercise</StyledTh>
                                <StyledTh>Repetitions</StyledTh>
                                <StyledTh>Sets</StyledTh>
                                <StyledTh>Maximum</StyledTh>
                                <StyledTh></StyledTh>
                            </StyledTr>
                        </thead>
                        <tbody>
                            {Array.from({ length: currentRows }).map((_, index) => (
                                <StyledTr key={index}>
                                    <StyledMuscleTd>
                                        <StyledInput
                                            {...register(`muscle_${index}`)}
                                            onChange={(e) => setValue(`muscle_${index}`, e.target.value)}
                                        />
                                    </StyledMuscleTd>
                                    <StyledExerciseTd>
                                        <StyledInput
                                            {...register(`exercise_${index}`)}
                                            onChange={(e) => setValue(`exercise_${index}`, e.target.value)}
                                        />
                                    </StyledExerciseTd>
                                    <StyledTd>
                                        <StyledInput
                                            {...register(`repetitions_${index}`)}
                                            type="number"
                                            onChange={(e) => setValue(`repetitions_${index}`, e.target.value)}
                                        />
                                    </StyledTd>
                                    <StyledTd>
                                        <StyledInput
                                            {...register(`sets_${index}`)}
                                            type="number"
                                            onChange={(e) => setValue(`sets_${index}`, e.target.value)}
                                        />
                                    </StyledTd>
                                    <StyledTd>
                                        <StyledInput
                                            {...register(`maximum_${index}`)}
                                            type="number"
                                            onChange={(e) => setValue(`maximum_${index}`, e.target.value)}
                                        />
                                    </StyledTd>
                                    <StyledTd>
                                        <FontAwesomeIcon
                                            icon={faTrashCan}
                                            style={{ cursor: 'pointer', color: '#FF5733' }}
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this row?')) {
                                                    deleteRow(index)
                                                }
                                            }
                                            }
                                        />

                                    </StyledTd>
                                </StyledTr>
                            ))}
                        </tbody>
                    </StyledTable>
                </StyledTableContainer>
                <StyledButtons>
                    <button type="submit" >Save</button>
                    {/* in a form tag, you have to use type="submit" to submit the form data. */}
                    {/* and when type is button, it means that button won't submit the form. */}
                    <button type="button" onClick={() => downloadTableAsImage("planTable")}>Download</button>
                    <button type="button" onClick={() => clearRows()}>Clear all</button>
                </StyledButtons>
            </StyledForm>
        </StyledPlan>
    )
}

// animation
const bounceColorChange = keyframes`
    0% {
        transform: translateY(0);
        color: #009879; // initial color
    }
    30% {
        transform: translateY(-20px); // move up 20px
        color: #FF5733; // midway color
    }
    100% {
        transform: translateY(0);
        color: #009879; // end color
    }
`;


const StyledPlan = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    padding: 3%;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 5%;
    margin-bottom: 5%;
`;

const StyledTitle = styled.h2`
    animation: ${bounceColorChange} 2s infinite; // animation name and duration
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin: 20px 0;
`

const StyledButtons = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
`;

const StyledTable = styled.table`
    border-collapse: collapse;
    text-align: left;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15);
`;

const StyledTr = styled.tr`
    background-color: #f3f3f3;
    border-bottom: 1px solid #ddd;
    &:hover {
        background-color: #f5f5f5;
    }
`;

const StyledTh = styled.th`
    padding: 12px 15px;
    background-color: #009879;
    color: white;
    font-weight: bold;
    font-size: 12px;
    border: 1px solid #ddd;
    position: sticky;
    top: 0;
    z-index: 1;  // raise it above other elements
`;

const StyledTd = styled.td`
    padding: 4px 6px;
    border: 1px solid #ddd;
`;

const StyledInput = styled.input`
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const StyledTableContainer = styled.div`
    overflow: auto;
    max-height: 300px;
    margin: 20px;
`;

const StyledMuscleTd = styled(StyledTd)`
    width: 20%; 
`;

const StyledExerciseTd = styled(StyledTd)`
    width: 20%; 
`;

const CalendarContainer = styled.div`
    display: flex;
    z-index: 2; // raise above other elements
    justify-content: flex-end;  // aligns to the right
`;

const StyledForm = styled.form`
    max-height: 500px;
`



export default Plan;