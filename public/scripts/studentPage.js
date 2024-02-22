document.addEventListener('DOMContentLoaded', async () => {
    try {
      // Assuming you have the studentId available, replace '123' with the actual studentId
      const studentId = studentData.id;
    //   console.log(studentId);
  
      // Fetch attendance data from the backend
      const response = await fetch(`/student/${studentId}/attendance`);
      const data = await response.json();
      console.log(data);
      // Display the attendance data on load
      // displayAttendance(data.attendance);
      const attendanceData = data.attendance.map(item => ({
        subject: item.subject,
        attendedclasses: item.attendedclasses,
        attendancedates: item.attendancedates,
      }));
      
      const totalClassesData = data.totalClasses.map(item => ({
        subject: item.subject,
        total_days: item.total_days,
      }));
      const attendanceTableBody = document.getElementById('attendance-table-body');
      attendanceData.forEach(item => {
        const row = `<tr>
                      <td>${item.subject}</td>
                      <td>${item.attendedclasses}</td>
                      <td>${item.attendancedates.join(', ')}</td>
                    </tr>`;
        attendanceTableBody.innerHTML += row;
      });
      const attendancePercentage = attendanceData.map(item => {
        const attendedClasses = parseInt(item.attendedclasses);
        const totalClasses = totalClassesData.find(totalItem => totalItem.subject === item.subject)?.total_days || 0;
      
        // Ensure totalClasses is not zero to avoid division by zero
        const percentage = totalClasses !== 0 ? (attendedClasses / totalClasses) * 100 : 0;
        console.log("attened classes: ",attendedClasses);
        console.log("total classes: ",totalClasses);
        console.log("percentage: ",percentage);
        return percentage.toFixed(2); // Round to two decimal places
      });


// Display total classes data in the table
    const totalClassesTableBody = document.getElementById('total-classes-table-body');
    totalClassesData.forEach(item => {
      const row = `<tr>
                    <td>${item.subject}</td>
                    <td>${item.total_days}</td>
                  </tr>`;
      totalClassesTableBody.innerHTML += row;
    });

    const subjectDetailsList = document.getElementById('subject-details-list');
    const subjectIcons = {
      'Math': 'fas fa-calculator',
      'Physics': 'fas fa-atom',
      'Chemistry': 'fas fa-flask',
      'English': 'fas fa-book',
      'Biology': 'fas fa-microscope',
      // Add more subjects and corresponding icons as needed
    };
      attendanceData.forEach(item => {
        const attendedClasses = parseInt(item.attendedclasses);
        const totalClasses = totalClassesData.find(totalItem => totalItem.subject === item.subject)?.total_days || 0;
        const percentage = totalClasses !== 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) : 0;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
        <div class="subject-details-div">
          <div class="icons>
              <i class="${subjectIcons[item.subject] || 'fas fa-question'}"></i>
          </div>
          <div class="details">
            <h3>Subject: ${item.subject}</h3>
            <p>Attended Classes: ${attendedClasses}</p>
            <p>Total Classes: ${totalClasses}</p>
            <p>Percentage: ${percentage}%</p>
          </div>
        </div>
        `;

        subjectDetailsList.appendChild(listItem);
    });

// Prepare data for the attendance chart
const attendanceChartLabels = attendanceData.map(item => item.subject);
const attendanceChartValues = attendanceData.map(item => item.attendedclasses);

// Generate random colors for each subject
const getRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;

const attendanceChartColors = attendanceData.map(() => getRandomColor());

// Display attendance chart
const ctx = document.getElementById('attendance-chart').getContext('2d');
const attendanceChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: attendanceChartLabels,
    datasets: [{
      label: 'Percentage',
      data: attendancePercentage,
      backgroundColor: attendanceChartColors,
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const percentage = attendancePercentage[context.dataIndex];
            return `Attended: ${context.parsed.y} - Percentage: ${percentage}%`;
          }
        }
      }
    },
    barPercentage: 0.8, // Adjust this value to control the width of the bars
    categoryPercentage: 0.7 
  }
});

    } catch (error) {
      console.error('Error fetching attendance:', error);
      // Handle error scenarios
    }
  });
  
  // function createAttendanceTables(attendanceData) {
  //   const container = document.getElementById('attendanceContainer');

  //   attendanceData.forEach(subjectData => {
  //       const table = createAttendanceTable(subjectData);
  //       container.appendChild(table);
  //   });
// }

// function createAttendanceTable(subjectData) {
//     const table = document.createElement('table');
//     const headerRow = table.insertRow();

//     // Create table headers
//     const subjectHeader = document.createElement('th');
//     subjectHeader.textContent = 'Subject: ' + subjectData.subject;
//     // subjectHeader.colSpan = 2; // Span both columns
//     headerRow.appendChild(subjectHeader);

//     const attendedClassesHeader = document.createElement('th');
//     attendedClassesHeader.textContent = 'Attended Classes';
//     headerRow.appendChild(attendedClassesHeader);

//     const attendanceDatesHeader = document.createElement('th');
//     attendanceDatesHeader.textContent = 'Attendance Dates';
//     headerRow.appendChild(attendanceDatesHeader);

//     // Keep track of displayed attended classes for formatting
//     let displayedClasses = null;

//     // Populate the table with attendance data
//     subjectData.attendancedates.forEach((date, index) => {
//         const row = table.insertRow();

//         // Populate data for each row
//         const emptyCell = row.insertCell();
//         // const emptyCell2 = row.insertCell();
//         const attendedClassesCell = row.insertCell();
//         const attendanceDatesCell = row.insertCell();

//         // Display attended classes only if different from the previous entry
//         if (subjectData.attendedclasses[index] !== displayedClasses) {
//             emptyCell.textContent=" ";
//             // emptyCell2.textContent=" ";
//             attendedClassesCell.textContent = subjectData.attendedclasses[index];
//             displayedClasses = subjectData.attendedclasses[index];
//         }

//         attendanceDatesCell.textContent = formatDate(date);
//     });

//     return table; // Return the created table
// }

// function formatDate(dateString) {
//     const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', options); // Use 'en-GB' for DD-MM-YYYY format
// }

//   // Function to display attendance data in the container
//   function displayAttendance(attendanceData) {
//     const attendanceContainer = document.getElementById('attendanceContainer');
  
//     // Clear previous content in the container
//     attendanceContainer.innerHTML = '';
  
//     // Check if there is attendance data to display
//     if (attendanceData && attendanceData.length > 0) {
//         const table = createAttendanceTables(attendanceData);
//         attendanceContainer.appendChild(table);
//     } else {
//       // If no attendance data is available, display a message
//       const noAttendanceMessage = document.createElement('p');
//       noAttendanceMessage.textContent = 'No attendance data available.';
//       attendanceContainer.appendChild(noAttendanceMessage);
//     }
//   }

// Function to display student attendance details
function displayStudentAttendanceDetails(studentData) {
    const attendanceDetailsContainer = document.getElementById('attendanceDetailsContainer');

    // Clear previous content in the container
    attendanceDetailsContainer.innerHTML = '';

    // Check if there is attendance data to display
    if (studentData && studentData.attendance) {
        const totalClasses = studentData.totalClasses || 0;
        const attendedClasses = studentData.attendedClasses || 0;
        const percentage = studentData.percentage || 0;

        // Create a div to hold the details
        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('attendance-details');

        // Add icons and text
        detailsDiv.innerHTML = `
            <div class="detail">
                <i class="fas fa-calendar"></i>
                <span>Total Classes: ${studentData.attendance.totalClasses}</span>
            </div>
            <div class="detail">
                <i class="fas fa-check-circle"></i>
                <span>Attended Classes: ${studentData.attendance.attendedClasses}</span>
            </div>
            <div class="detail">
                <i class="fas fa-percent"></i>
                <span>Attendance Percentage: ${studentData.attendance.percentage}%</span>
            </div>
        `;

        // Append the details to the container
        attendanceDetailsContainer.appendChild(detailsDiv);
    } else {
        // If no attendance data is available, display a message
        const noAttendanceMessage = document.createElement('p');
        noAttendanceMessage.textContent = 'No attendance data available.';
        attendanceDetailsContainer.appendChild(noAttendanceMessage);
    }
}

displayStudentAttendanceDetails(studentData);

// document.addEventListener('DOMContentLoaded', function() {
//   // Your code here, including the function displayStudentAttendanceChart

// async function fetchStudentAttendance(studentId) {
//     try {
//       const response = await fetch(`/student/${studentId}/attendance`);
//       const data = await response.json();
//       return data.attendance; // Assuming data.attendance contains the attendance details per subject
//     } catch (error) {
//       console.error('Error fetching student attendance data:', error);
//       return {};
//     }
//   }
  
//   async function displayStudentAttendanceChart(studentId) {
//     const attendanceData = await fetchStudentAttendance(studentId);
  
//     const subjectLabels = Object.keys(attendanceData);
//     const attendancePercentages = Object.values(attendanceData).map(subjectData => {
//       const totalClasses = 10;
//       const attendedClasses = subjectData.attendedClasses;
//       return ((attendedClasses / totalClasses) * 100).toFixed(2);
//     });
  
//     const ctx = document.getElementById('attendanceChart').getContext('2d');
  
//     new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: subjectLabels,
//         datasets: [{
//           label: 'Attendance Percentage',
//           data: attendancePercentages,
//           backgroundColor: 'rgba(54, 162, 235, 0.5)', // Adjust color as needed
//           borderColor: 'rgba(54, 162, 235, 1)', // Adjust color as needed
//           borderWidth: 1
//         }]
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true,
//             title: {
//               display: true,
//               text: 'Attendance Percentage (%)'
//             }
//           },
//           x: {
//             title: {
//               display: true,
//               text: 'Subjects'
//             }
//           }
//         }
//       }
//     });
//   }
  
//   // Call displayStudentAttendanceChart with the specific student ID when needed
//   displayStudentAttendanceChart('5029621222'); // Replace 'student123' with the actual student ID
// });