import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async Thunks
export const fetchAlerts = createAsyncThunk('alerts/fetchAlerts', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/alerts');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const createAlert = createAsyncThunk('alerts/createAlert', async (alertData, { rejectWithValue }) => {
    try {
        const res = await api.post('/alerts', alertData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const markAllRead = createAsyncThunk('alerts/markAllRead', async (_, { rejectWithValue }) => {
    try {
        await api.put('/alerts/read');
        return;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});



export const hideAlert = createAsyncThunk('alerts/hideAlert', async (id, { rejectWithValue }) => {
    try {
        await api.put(`/alerts/${id}/hide`);
        return id;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const deleteAlert = createAsyncThunk('alerts/deleteAlert', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/alerts/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const alertSlice = createSlice({
    name: 'alerts',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        addAlert: (state, action) => {
            // Used for real-time socket updates
            state.items.unshift(action.payload);
        },
        markAsRead: (state, action) => {
            const alert = state.items.find(a => a._id === action.payload);
            if (alert) alert.read = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlerts.pending, (state) => { state.loading = true; })
            .addCase(fetchAlerts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchAlerts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createAlert.fulfilled, (state, action) => {
                // Optimistic update or wait for socket? Socket will handle broadcast
                // state.items.unshift(action.payload); 
            })
            .addCase(markAllRead.fulfilled, (state) => {
                state.items.forEach(item => item.read = true);
            })
            .addCase(deleteAlert.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            })
            .addCase(hideAlert.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            });
    }
});

export const { addAlert, markAsRead } = alertSlice.actions;
export default alertSlice.reducer;
