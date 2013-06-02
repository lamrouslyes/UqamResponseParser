/*
 * Copyright 2013 Jacques Berger.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var jsdom = require("jsdom");

exports.parse = function(htmlFragment, callback) {
  jsdom.env(htmlFragment, ["http://code.jquery.com/jquery.js"], function(err, window) {
    if (err) {
      callback(err);
    } else {
      var notOffered = window.$("p.rerreur1");
      if (notOffered.length) {
        callback(null, {message: notOffered[0].textContent.trim()});
      } else {
        callback(null, parseGroupList(window));
      }
    }

    if (window) {
      window.close();
    }
  });
};

function courseAlreadyDefined(array, course) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].jour === course.jour && array[i].debut === course.debut) {
      return true;
    }
  }
  return false;
}

function parseGroupList(window) {
  var result = [];
  var tableList = window.$("table");
  if (tableList.length > 1) {
    var tdList = tableList[1].getElementsByTagName("td");

    var group;

    var i = 0;
    while (i < tdList.length) {
      var newGroup = false;
      if (tdList[i].getAttribute("colspan")) {
        i++;
        newGroup = true;
        if (i >= tdList.length) {
          break;
        }
      }

      if (newGroup || i === 0) {
        group = {};
        result.push(group);
        group.groupe = parseInt(tdList[i].textContent, 10);
        group.places_restantes = parseInt(tdList[i + 1].textContent, 10);
        group.seances = [];
      }

      var course = {};
      course.jour = tdList[i + 3].textContent;
      course.debut = tdList[i + 4].textContent;
      course.fin = tdList[i + 5].textContent;
      i += 8;
      if (!courseAlreadyDefined(group.seances, course)) {
        group.seances.push(course);
      }
    }
  }

  return result;
}
