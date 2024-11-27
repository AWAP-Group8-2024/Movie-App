import { useState } from "react";

export default function JoinRequestElement({ request, handleGroupRequest }) {
    const [requestStatus, setRequestStatus] = useState('');

    return (
        <tr>
            <td>{request.email}</td>
            <td>
            {request.firstname || "N/A"} {request.lastname || "N/A"}
            </td>
            <td>{new Date(request.request_date).toLocaleString()}</td>
            <td>
            <select
                className="form-select mb-2"
                value={requestStatus}
                onChange={(e) => setRequestStatus(e.target.value)}
            >
                <option value="">Select Status</option>
                <option value="accepted">Accept</option>
                <option value="rejected">Reject</option>
            </select>
            <button
                className="btn btn-primary mt-2 me-2"
                onClick={() => {handleGroupRequest(request.id, requestStatus)}}
                disabled={!requestStatus}
            >
                Submit
            </button>
            </td>
        </tr>
    )
}