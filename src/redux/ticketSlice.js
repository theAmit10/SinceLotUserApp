import {createSlice} from '@reduxjs/toolkit';

import Toast from 'react-native-toast-message';

const MAX_NUMBERS = 6; // Adjust this based on your requirements
const ballNumbers = Array.from({length: 50}, (_, i) => i + 1); // Example range: 1-50
const MAX_TICKETS = 10; // Define max tickets limit

const initialState = {
  tickets: [{selectedNumbers: Array(MAX_NUMBERS).fill(null), multiplier: null}],
  activeTicketIndex: 0,
  activeBallIndex: 0,
  showMultipliers: false,
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    // addTicketR: (state) => {
    //   state.tickets.push({
    //     selectedNumbers: Array(MAX_NUMBERS).fill(null),
    //     multiplier: null,
    //   });
    //   state.activeTicketIndex = state.tickets.length - 1;
    //   state.activeBallIndex = 0;
    // },
    addTicketR: state => {
      if (state.tickets.length < MAX_TICKETS) {
        state.tickets.push({
          selectedNumbers: Array(MAX_NUMBERS).fill(null),
          multiplier: null,
        });
        state.activeTicketIndex = state.tickets.length - 1;
        state.activeBallIndex = 0;
      } else {
        console.log(
          'Ticket limit reached. You can add a maximum of 10 tickets.',
        );
        Toast.show({
          type: 'error',
          text1: 'Ticket limit reached.',
          text2: ' You can add a maximum of 10 tickets.',
        });
      }
    },
    // addMultipleTicketsR: (state, action) => {
    //   const numTickets = parseInt(action.payload, 10);
    //   if (!isNaN(numTickets) && numTickets > 0) {
    //     const newTickets = Array.from({ length: numTickets }, () => ({
    //       selectedNumbers: Array(MAX_NUMBERS).fill(null),
    //       multiplier: null,
    //     }));
    //     state.tickets = [...state.tickets, ...newTickets];
    //   }
    // },

    addMultipleTicketsR: (state, action) => {
      const numTickets = parseInt(action.payload, 10);
      if (!isNaN(numTickets) && numTickets > 0) {
        const remainingSlots = MAX_TICKETS - state.tickets.length;
        const ticketsToAdd = Math.min(numTickets, remainingSlots);

        if (ticketsToAdd > 0) {
          const newTickets = Array.from({length: ticketsToAdd}, () => ({
            selectedNumbers: Array(MAX_NUMBERS).fill(null),
            multiplier: null,
          }));
          state.tickets = [...state.tickets, ...newTickets];
        } else {
          console.warn('Cannot add more tickets. Maximum limit reached.');
          Toast.show({
            type: 'error',
            text1: 'Cannot add more tickets. ',
            text2: ' Maximum limit reached.',
          });
        }
      }
    },
    removeTicketR: state => {
      if (state.tickets.length > 1) {
        state.tickets.pop();
        if (state.activeTicketIndex >= state.tickets.length) {
          state.activeTicketIndex = state.tickets.length - 1;
        }
      }
    },
    // handleNumberSelectR: (state, action) => {
    //   const { number } = action.payload;
    //   const currentTicket = state.tickets[state.activeTicketIndex];
    //   const updatedNumbers = [...currentTicket.selectedNumbers];

    //   if (updatedNumbers.includes(number)) {
    //     const indexToRemove = updatedNumbers.indexOf(number);
    //     updatedNumbers[indexToRemove] = null;
    //   } else {
    //     updatedNumbers[state.activeBallIndex] = number;
    //     // const indexToRemove = updatedNumbers.indexOf(number);
    //     // updatedNumbers[indexToRemove] = null;
    //   }

    //   state.tickets[state.activeTicketIndex] = {
    //     ...currentTicket,
    //     selectedNumbers: updatedNumbers,
    //   };

    //   const nextEmptyIndex = updatedNumbers.indexOf(null);
    //   if (nextEmptyIndex !== -1) {
    //     state.activeBallIndex = nextEmptyIndex;
    //   }
    // },

    handleNumberSelectR: (state, action) => {
      const {number, ticketIndex} = action.payload;

      // Check if the clicked ticket is different from the active one
      if (
        ticketIndex !== undefined &&
        ticketIndex !== state.activeTicketIndex
      ) {
        console.log(
          'Please activate the ticket first before selecting numbers.',
        );

        Toast.show({
          type: 'error',
          text1: 'Please select the ticket first before selecting numbers.',
        });
        return; // Exit the function without making changes
      }

      const currentTicket = state.tickets[state.activeTicketIndex];
      const updatedNumbers = [...currentTicket.selectedNumbers];

      if (updatedNumbers.includes(number)) {
        const indexToRemove = updatedNumbers.indexOf(number);
        updatedNumbers[indexToRemove] = null;
      } else {
        updatedNumbers[state.activeBallIndex] = number;
      }

      state.tickets[state.activeTicketIndex] = {
        ...currentTicket,
        selectedNumbers: updatedNumbers,
      };

      const nextEmptyIndex = updatedNumbers.indexOf(null);
      if (nextEmptyIndex !== -1) {
        state.activeBallIndex = nextEmptyIndex;
      }
    },

    handleNumberSelectTicketR: (state, action) => {
      const {number} = action.payload;
      const currentTicket = state.tickets[state.activeTicketIndex];
      const updatedNumbers = [...currentTicket.selectedNumbers];

      if (updatedNumbers.includes(number)) {
        const indexToRemove = updatedNumbers.indexOf(number);
        updatedNumbers[indexToRemove] = null;
      } else {
        updatedNumbers[state.activeBallIndex] = number;
        // const indexToRemove = updatedNumbers.indexOf(number);
        // updatedNumbers[indexToRemove] = null;
      }

      state.tickets[state.activeTicketIndex] = {
        ...currentTicket,
        selectedNumbers: updatedNumbers,
      };

      const nextEmptyIndex = updatedNumbers.indexOf(null);
      if (nextEmptyIndex !== -1) {
        state.activeBallIndex = nextEmptyIndex;
      }
    },
    // handleMultiplierSelectR: (state, action) => {
    //   state.tickets[state.activeTicketIndex].multiplier = action.payload;
    //   state.showMultipliers = false;
    // },
    handleMultiplierSelectR: (state, action) => {
      if (
        state.activeTicketIndex === null ||
        state.activeTicketIndex >= state.tickets.length
      ) {
        console.error('Invalid activeTicketIndex:', state.activeTicketIndex);
        return;
      }

      state.tickets = state.tickets.map((ticket, index) =>
        index === state.activeTicketIndex
          ? {...ticket, multiplier: action.payload} // ✅ Store payload directly (not an object)
          : ticket,
      );

      state.showMultipliers = false;
    },

    // generateUniqueRandomNumbersR: (state) => {
    //   let usedNumbers = [];

    //   state.tickets = state.tickets.map((ticket) => {
    //     let ticketNumbers = Array(MAX_NUMBERS).fill(null);

    //     const emptyIndexes = ticketNumbers
    //       .map((_, index) => index)
    //       .filter((index) => ticketNumbers[index] === null);

    //     emptyIndexes.forEach((index) => {
    //       let randomNum;
    //       do {
    //         randomNum =
    //           ballNumbers[Math.floor(Math.random() * ballNumbers.length)];
    //       } while (
    //         usedNumbers.includes(randomNum) ||
    //         ticketNumbers.includes(randomNum)
    //       );

    //       ticketNumbers[index] = randomNum;
    //       usedNumbers.push(randomNum);
    //     });

    //     return { ...ticket, selectedNumbers: ticketNumbers };
    //   });
    // },

    generateUniqueRandomNumbersR: state => {
      state.tickets = state.tickets.map(ticket => {
        let ticketNumbers = Array(MAX_NUMBERS).fill(null);
        let usedNumbers = new Set(); // ✅ Use Set for faster lookups (per ticket)

        const emptyIndexes = ticketNumbers
          .map((_, index) => index)
          .filter(index => ticketNumbers[index] === null);

        emptyIndexes.forEach(index => {
          let randomNum;
          let attempts = 0; // ✅ Prevent infinite loop

          do {
            randomNum =
              ballNumbers[Math.floor(Math.random() * ballNumbers.length)];
            attempts++;
            if (attempts > 100) break; // ✅ Escape if too many attempts
          } while (usedNumbers.has(randomNum));

          ticketNumbers[index] = randomNum;
          usedNumbers.add(randomNum);
        });

        return {...ticket, selectedNumbers: ticketNumbers};
      });
    },

    resetTickets: state => {
      state.activeBallIndex = 0;
      state.activeTicketIndex = 0;
      state.tickets = [
        {selectedNumbers: Array(MAX_NUMBERS).fill(null), multiplier: null},
      ];
    },

    setYellowBall: (state, action) => {
      state.activeTicketIndex = action.payload;
      state.showMultipliers = true;
    },

    setYellowBallClick: (state, action) => {
      const {ticketIndex, ballIndex} = action.payload;
      state.activeTicketIndex = ticketIndex;
      state.activeBallIndex = ballIndex;
      state.showMultipliers = true;
    },
  },
});

export const {
  addTicketR,
  addMultipleTicketsR,
  removeTicketR,
  handleNumberSelectR,
  handleMultiplierSelectR,
  generateUniqueRandomNumbersR,
  resetTickets,
  setYellowBall,
  setYellowBallClick,
  handleNumberSelectTicketR,
} = ticketSlice.actions;
export default ticketSlice.reducer;
