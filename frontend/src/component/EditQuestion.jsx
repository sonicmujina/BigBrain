import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Grid, Typography, Button, TextField } from '@material-ui/core';
import { FormControl, InputLabel, Select, Box, FormGroup, Checkbox } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { Formik, Form, Field, FieldArray } from 'formik';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const EditQuestion = () => {
  const { id, qid } = useParams();
  const token = localStorage.getItem('token');
  const [initialValues, setInitialValues] = useState({
    type: 'single-choice',
    questionText: '',
    timeLimit: 0,
    points: 1,
    media: '',
    answers: [
      { answerText: '', isCorrect: true },
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false },
    ],
  });
  const times = [
    { value: 5, label: '5 seconds' },
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 45, label: '45 seconds' },
    { value: 60, label: '60 seconds' }
  ];
  const points = [
    { value: -10000, label: '-10000' },
    { value: 0, label: '0' },
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 1000, label: '1000' },
  ];

  // Fetch the question data from the server when the component mounts
  useEffect(() => {
    console.log(qid);
    fetch(`http://localhost:5005/admin/quiz/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch question data');
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          // console.log(data.questions)
          // console.log('questions initial stuff:', initialValues);
          setInitialValues(data);
        }
      })
      .catch(error => {
        console.log(error);
        console.log('Could not fetch question data');
      });
  }, []);

  return (
    <>
      <Link to={`/editGame/${id}`}>
        <Typography>
          Back
        </Typography>
      </Link>
      <Typography variant="h6" component="h3" gutterBottom>
        Edit Question
      </Typography>
      <Formik
        initialValues={{
          type: initialValues.type,
          questionText: initialValues.questionText,
          timeLimit: initialValues.timeLimit,
          points: initialValues.points,
          media: initialValues.media,
          answers: initialValues.answers,
        }}
        validate={(values) => {
          const errors = {};
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          fetch(`http://localhost:5005/admin/quiz/${id}`, {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(values)
          })
            .then(res => {
              if (!res.ok) {
                throw new Error('Failed to update question data');
              }
              return res.json();
            })
            .then(data => {
              // Handle successful submission
              console.log(data);
              console.log('SUBMITTING DATA');
              setSubmitting(false);
            })
            .catch(error => {
              console.log(error);
              console.log('Could not update question data');
              setErrors({ submit: 'Failed to update question' });
              setSubmitting(false);
            });
        }}

      >
    {({
      values,
      submitForm,
      isSubmitting,
      setFieldValue,
    }) => (
      <Form onSubmit={submitForm}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <Field
                component={Select}
                type="text"
                label="Question Type"
                name="Question Type"
                id="type"
              >
                <MenuItem value="single-choice">Single Choice</MenuItem>
                <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
              </Field>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
          <Field
            name="questionText"
            type="text"
            label="Question"
            component={TextField}
          />
          </Grid>
          <Grid item xs={12}>
            <Field
              component={TextField}
              type="text"
              name="select"
              label="Time Limit"
              select
              variant="standard"
              helperText="Please select time limit"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            >
              {times.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field>
          </Grid>
          <Grid item xs={12}>
            <Field
                component={TextField}
                type="text"
                name="select"
                label="Points"
                select
                variant="standard"
                helperText="Please select how many points the question is worth"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {points.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Image/URL (Optional)</InputLabel>
              <Box display="flex" alignItems="center">
                <Field name="image">
                  {({ field, form, meta }) => (
                    <div>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          form.setFieldValue(
                            'image',
                            event.currentTarget.files[0]
                          );
                        }}
                      />
                      {meta.touched && meta.error && (
                        <div className="error">{meta.error}</div>
                      )}
                    </div>
                  )}
                </Field>
                <Field
                  as={TextField}
                  label="or URL"
                  name="url"
                  type="text"
                  fullWidth
                />
              </Box>
          </Grid>
          <Grid item xs={12}>
            <FieldArray name="answers">
              {({ insert, remove, push }) => (
                <div>
                  {values['Question Type'] === 'single-choice' && (
                    <RadioGroup
                      aria-label="answers"
                      name="answers"
                      value={values.answers}
                      onChange={(event) => {
                        values.answers.forEach((answer, index) => {
                          if (answer.answerText === event.target.value) {
                            setFieldValue(`answers[${index}].isChecked`, true);
                          } else {
                            setFieldValue(`answers[${index}].isChecked`, false);
                          }
                        });
                      }}
                    >
                      {values.answers.map((answer, index) => (
                        <FormControlLabel
                          key={index}
                          value={answer.answerText}
                          control={<Radio />}
                          label={
                            <TextField
                              type="text"
                              name={`answers[${index}].answerText`}
                              label={`Answer ${index + 1}`}
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          }
                        />
                      ))}
                    </RadioGroup>
                  )}
                  {values['Question Type'] !== 'single-choice' && (
                    <FormGroup>
                      {values.answers.map((answer, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              name={`answers[${index}].isChecked`}
                              checked={values.answers[index].isChecked}
                              onChange={(event) => {
                                setFieldValue(
                                  `answers[${index}].isChecked`,
                                  event.target.checked
                                );
                              }}
                            />
                          }
                          label={
                            <TextField
                              type="text"
                              name={`answers[${index}].answerText`}
                              label={`Answer ${index + 1}`}
                              variant="outlined"
                              size="small"
                              fullWidth
                              style={{ padding: '10px' }}
                            />
                          }
                        />
                      ))}
                    </FormGroup>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      push({
                        answerText: '',
                        isChecked: false,
                      })
                    }
                  >
                    Add Answer
                  </Button>
                </div>
              )}
            </FieldArray>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              Submit
            </Button>
        </Grid>
        </Grid>
      </Form>
    )}
    </Formik>
  </>
  );
};
export default EditQuestion;
