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

exports.parse = function(htmlFragment, callback) {
  var error = htmlFragment.match(/<P CLASS="rerreur1">[^<]*<\/P>/g);
  if (error) {
    var errorStr = error[0];
    errorStr = errorStr.replace('<P CLASS="rerreur1">', '').replace("</P>", "").trim();
    callback(null, {message: errorStr});
  } else {
    callback(null, parseGroupList(htmlFragment));
  }
};

function courseAlreadyDefined(array, course) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].jour === course.jour && array[i].debut === course.debut) {
      return true;
    }
  }
  return false;
}

function extractDataFromTdElement(element) {
  var dataPosition = element.indexOf(">") + 1;
  return element.substr(dataPosition, element.lastIndexOf("<") - dataPosition);
}

function parseGroupList(html) {
  var result = [];

  var tdList = html.match(/^(?:<td align="center" class="paragraphe">(.+)<\/td>|<td><\/td>|<td>&nbsp;<\/td>)$/mgi);
  var group;

  var i = 0;
  while (i < tdList.length) {
    var thisData = extractDataFromTdElement(tdList[i]);

    if (thisData) {
      group = {};
      result.push(group);
      group.groupe = parseInt(thisData, 10);
      group.places_restantes = parseInt(extractDataFromTdElement(tdList[i + 1]), 10);
      group.seances = [];
    }

    var course = {};
    course.jour = extractDataFromTdElement(tdList[i + 3]);
    course.debut = extractDataFromTdElement(tdList[i + 4]);
    course.fin = extractDataFromTdElement(tdList[i + 5]);
    i += 8;
    if (!courseAlreadyDefined(group.seances, course)) {
      group.seances.push(course);
    }
  }

  return result;
}
