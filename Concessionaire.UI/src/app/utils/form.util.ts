export class FormUtil {

  static buildFormData(payload: any) {
    const formData = new FormData();
    for (const prop in payload) {
      if (!payload.hasOwnProperty(prop)) {
        continue;
      }

      if (typeof payload[prop] === 'number') {
        let stringNumber = Number(payload[prop]).toString();
        stringNumber = stringNumber.replace('.', ',');

        formData.append(prop, stringNumber);
      } else if (typeof payload[prop] === 'object') {
        if (Array.isArray(payload[prop])) {
          let arrayTemp = payload[prop] as any[];
          if (arrayTemp.length) {
            for (var i = 0; i < arrayTemp.length; i++) {
              for (const field in arrayTemp[i]) {
                if (!arrayTemp[i].hasOwnProperty(field)) {
                  continue;
                }

                let val = arrayTemp[i][field];
                if (typeof val === 'number') {
                  let stringNumber = Number(val).toString();
                  stringNumber = stringNumber.replace('.', ',');

                  formData.append(`${prop}[${i}].${field}`, stringNumber);
                } else {
                  formData.append(`${prop}[${i}].${field}`, arrayTemp[i][field]);
                }
              }
            }
          }
        } else {
          formData.append(prop, payload[prop]);
        }
      } else {
        if (payload[prop] != 'null' && payload[prop] != null) {
          formData.append(prop, payload[prop]);
        }
      }
    }

    return formData;
  }
}
