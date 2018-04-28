/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
  model = {
    init: function() {
      this.attendance = JSON.parse(localStorage.attendance);
    },

    save: function() {
      localStorage.attendance = JSON.stringify(this.attendance);
    },
  };

  octopus = {
    init: function() {
console.log('Starting model init...')
      model.init();
console.log('Model init complete')
console.log('Starting view init')
      view.init();
console.log('View init complete')
    },

    getAttendance: function() {
      const sum = days => days.filter(present => present).length;

      return Object.entries(model.attendance)
        .map(([name, days]) => ({
          name,
          days,
          missed: sum(days),
         }));
    },

    toggleAttendance: function(name, day) {
      model.attendance[name][day] = !model.attendance[name][day];
      model.save();
      view.render();
    }
  };

  view = {
    init: function() {
      this.tbody = document.querySelector('tbody');

      this.tbody.addEventListener('click', event => {
        if (event.target.type !== 'checkbox') return;

        const name = event.target.closest('tr').firstElementChild.textContent;
        const day = event.target.dataset.day;
        octopus.toggleAttendance(name, day);
      });

      this.render();
    },

    render: function() {
      this.tbody.innerHTML =
        octopus.getAttendance()
          .map(student => 
            `<tr class="student">
              <td class="name-col">${student.name}</td>` +

              student.days.map((present, index) => 
                `<td class="attend-col"><input type="checkbox" data-day="${index}"` + 
                (present ? ` checked` : ``) +
                `></td>`
              ).join('\n') +

              `<td class="missed-col">${student.missed}</td>
            </tr>`
          ).join('\n');
    },
  };

  octopus.init();
}());
