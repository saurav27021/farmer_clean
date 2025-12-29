import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const submitReport = createAsyncThunk('reports/submitReport', async (reportData, { rejectWithValue }) => {
    try {
        const res = await api.post('/reports', reportData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const fetchReports = createAsyncThunk('reports/fetchReports', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/reports');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const deleteReport = createAsyncThunk('reports/deleteReport', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/reports/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const resolveReport = createAsyncThunk('reports/resolveReport', async ({ id, solution }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/reports/${id}/resolve`, { solution });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const reportSlice = createSlice({
    name: 'reports',
    initialState: {
        items: [], // Stores all reports
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetReportStatus: (state) => {
            state.success = false;
            state.error = null;
        },
        addReport: (state, action) => {
            // Check if report already exists to avoid duplicates from socket + optimistic update
            const exists = state.items.some(r => r._id === action.payload._id);
            if (!exists) {
                state.items.unshift(action.payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitReport.pending, (state) => { state.loading = true; })
            .addCase(submitReport.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
                state.success = true;
            })
            .addCase(submitReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(deleteReport.fulfilled, (state, action) => {
                state.items = state.items.filter(report => report._id !== action.payload);
            })
            .addCase(resolveReport.fulfilled, (state, action) => {
                const index = state.items.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    }
});

export const { resetReportStatus, addReport } = reportSlice.actions;
export default reportSlice.reducer;
