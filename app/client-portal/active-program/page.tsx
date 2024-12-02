// app/client-portal/active-program/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/UserContext'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  Timestamp,
  getDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { WorkoutProgram } from '@/lib/hooks/workout-programs/types'
import { ActiveProgram } from '@/lib/hooks/active-programs/types'
import { DailyRoutine } from '@/lib/hooks/daily-routines/types'
import SetGoalsModal from '@/components/modals/workout-programs/SetGoalsModal'
import ConfirmationModal from '@/components/modals/ConfirmationModal'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Set as SetType } from '@/lib/hooks/sets/types'
import { Exercise } from '@/lib/hooks/exercises/types'

const ActiveProgramPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth()
  const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null)
  const [workoutProgram, setWorkoutProgram] = useState<WorkoutProgram | null>(
    null
  )
  const [dailyRoutines, setDailyRoutines] = useState<DailyRoutine[]>([])
  const [sets, setSets] = useState<SetType[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isSetGoalsModalOpen, setIsSetGoalsModalOpen] = useState<boolean>(false)
  const [isAbandonModalOpen, setIsAbandonModalOpen] = useState<boolean>(false)
  const [isEndModalOpen, setIsEndModalOpen] = useState<boolean>(false)

  const router = useRouter()

  // Fetch ActiveProgram and WorkoutProgram
  useEffect(() => {
    const fetchActiveAndWorkoutProgram = async () => {
      if (authLoading) return
      if (!user) {
        setError('User not authenticated.')
        setLoading(false)
        return
      }

      try {
        // Fetch ActiveProgram
        const activeProgramsRef = collection(db, 'activePrograms')
        const activeProgramQuery = query(
          activeProgramsRef,
          where('userId', '==', user.uid)
        )
        const activeProgramSnapshot = await getDocs(activeProgramQuery)

        if (activeProgramSnapshot.empty) {
          setActiveProgram(null)
          setLoading(false)
          return
        }

        const activeProgramDoc = activeProgramSnapshot.docs[0]
        const activeProgramData = activeProgramDoc.data()

        const fetchedActiveProgram: ActiveProgram = {
          id: activeProgramDoc.id,
          userId: activeProgramData.userId,
          programId: activeProgramData.programId,
          startedAt: activeProgramData.startedAt.toDate(),
          goals: activeProgramData.goals,
          photoURL: activeProgramData.photoURL || '',
        }

        setActiveProgram(fetchedActiveProgram)

        // Fetch WorkoutProgram
        const workoutProgramRef = doc(
          db,
          'workoutPrograms',
          fetchedActiveProgram.programId
        )
        const workoutProgramSnap = await getDoc(workoutProgramRef)
        if (workoutProgramSnap.exists()) {
          const wpData = workoutProgramSnap.data()
          const fetchedWorkoutProgram: WorkoutProgram = {
            id: workoutProgramSnap.id,
            name: wpData.name,
            description: wpData.description,
            totalPhases: wpData.totalPhases,
            totalWeeks: wpData.totalWeeks,
            phases: wpData.phases || [],
            dailyRoutines: wpData.dailyRoutines || [], // string[] of DailyRoutine IDs
            sets: wpData.sets || [], // string[] of Set IDs
            exercises: wpData.exercises || [], // string[] of Exercise IDs
            createdAt: wpData.createdAt.toDate(),
            userId: wpData.userId,
          }
          setWorkoutProgram(fetchedWorkoutProgram)
        } else {
          setError('Workout Program not found.')
        }
      } catch (err: unknown) {
        console.error('Error fetching active/workout program:', err)
        setError('An error occurred while fetching your active program.')
      } finally {
        setLoading(false)
      }
    }

    fetchActiveAndWorkoutProgram()
  }, [user, authLoading])

  // Fetch DailyRoutines based on WorkoutProgram.dailyRoutines
  useEffect(() => {
    const fetchDailyRoutines = async () => {
      if (!workoutProgram) return
      if (workoutProgram.dailyRoutines.length === 0) return

      try {
        const routinesPromises = workoutProgram.dailyRoutines.map(
          async (routineId: string) => {
            const routineRef = doc(db, 'dailyRoutines', routineId)
            const routineSnap = await getDoc(routineRef)
            if (routineSnap.exists()) {
              const routineData = routineSnap.data()
              const fetchedRoutine: DailyRoutine = {
                id: routineSnap.id,
                name: routineData.name,
                description: routineData.description || '',
                type: routineData.type,
                sets: routineData.sets || [],
                createdAt: routineData.createdAt.toDate(),
              }
              return fetchedRoutine
            } else {
              return null
            }
          }
        )

        const fetchedRoutines = await Promise.all(routinesPromises)
        const validRoutines = fetchedRoutines.filter(
          (routine): routine is DailyRoutine => routine !== null
        )
        setDailyRoutines(validRoutines)
      } catch (err: unknown) {
        console.error('Error fetching daily routines:', err)
        setError('An error occurred while fetching daily routines.')
      }
    }

    fetchDailyRoutines()
  }, [workoutProgram])

  // Fetch Sets based on WorkoutProgram.sets
  useEffect(() => {
    const fetchSets = async () => {
      if (!workoutProgram) return
      if (workoutProgram.sets.length === 0) return

      try {
        const setsPromises = workoutProgram.sets.map(async (setId: string) => {
          const setRef = doc(db, 'sets', setId)
          const setSnap = await getDoc(setRef)
          if (setSnap.exists()) {
            const setData = setSnap.data()
            const fetchedSet: SetType = {
              id: setSnap.id,
              name: setData.name,
              description: setData.description || '',
              exercises: setData.exercises || [],
              userId: setData.userId,
              createdAt: setData.createdAt.toDate(),
            }
            return fetchedSet
          } else {
            return null
          }
        })

        const fetchedSets = await Promise.all(setsPromises)
        const validSets = fetchedSets.filter(
          (set): set is SetType => set !== null
        )
        setSets(validSets)
      } catch (err: unknown) {
        console.error('Error fetching sets:', err)
        setError('An error occurred while fetching sets.')
      }
    }

    fetchSets()
  }, [workoutProgram])

  // Fetch Exercises based on WorkoutProgram.exercises
  useEffect(() => {
    const fetchExercises = async () => {
      if (!workoutProgram) return
      if (workoutProgram.exercises.length === 0) return

      try {
        const exercisesPromises = workoutProgram.exercises.map(
          async (exerciseId: string) => {
            const exerciseRef = doc(db, 'exercises', exerciseId)
            const exerciseSnap = await getDoc(exerciseRef)
            if (exerciseSnap.exists()) {
              const exerciseData = exerciseSnap.data()
              const fetchedExercise: Exercise = {
                id: exerciseSnap.id,
                name: exerciseData.name,
                description: exerciseData.description || '',
                bodyParts: exerciseData.bodyParts || [],
                measurements: exerciseData.measurements || {
                  reps: false,
                  amap: false,
                  timed: false,
                  laps: false,
                },
                weight: exerciseData.weight,
                createdAt: exerciseData.createdAt.toDate(),
              }
              return fetchedExercise
            } else {
              return null
            }
          }
        )

        const fetchedExercises = await Promise.all(exercisesPromises)
        const validExercises = fetchedExercises.filter(
          (ex): ex is Exercise => ex !== null
        )
        setExercises(validExercises)
      } catch (err: unknown) {
        console.error('Error fetching exercises:', err)
        setError('An error occurred while fetching exercises.')
      }
    }

    fetchExercises()
  }, [workoutProgram])

  const handleOpenSetGoalsModal = () => {
    setIsSetGoalsModalOpen(true)
  }

  const handleCloseSetGoalsModal = () => {
    setIsSetGoalsModalOpen(false)
    // Optionally, refetch active program to get updated goals
    window.location.reload()
  }

  const handleOpenAbandonModal = () => {
    setIsAbandonModalOpen(true)
  }

  const handleCloseAbandonModal = () => {
    setIsAbandonModalOpen(false)
  }

  const handleConfirmAbandon = async () => {
    if (!activeProgram) return
    try {
      await deleteDoc(doc(db, 'activePrograms', activeProgram.id))
      setIsAbandonModalOpen(false)
      router.push('/client-portal') // Redirect or update UI as needed
    } catch (err: unknown) {
      console.error('Error abandoning program:', err)
      setError('An error occurred while abandoning the program.')
      setIsAbandonModalOpen(false)
    }
  }

  const handleOpenEndModal = () => {
    setIsEndModalOpen(true)
  }

  const handleCloseEndModal = () => {
    setIsEndModalOpen(false)
  }

  const handleConfirmEnd = async () => {
    if (!activeProgram) return
    try {
      // Move to completedPrograms
      const completedProgramsRef = collection(db, 'completedPrograms')
      await addDoc(completedProgramsRef, {
        userId: activeProgram.userId,
        programId: activeProgram.programId,
        startedAt: activeProgram.startedAt,
        endedAt: Timestamp.now(),
        goals: activeProgram.goals,
        photoURL: activeProgram.photoURL || '',
      })

      // Remove from activePrograms
      await deleteDoc(doc(db, 'activePrograms', activeProgram.id))

      setIsEndModalOpen(false)
      router.push('/client-portal') // Redirect or update UI as needed
    } catch (err: unknown) {
      console.error('Error ending program:', err)
      setError('An error occurred while ending the program.')
      setIsEndModalOpen(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <p>Loading your active program...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <p className='text-red-500'>{error}</p>
      </div>
    )
  }

  if (!activeProgram) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-background px-4'>
        <div className='p-6 bg-background-secondary rounded-md shadow-md'>
          <h1 className='text-3xl font-semibold mb-4'>No Active Program</h1>
          <p>You don&apos;t have any active programs. Start a new one!</p>
        </div>
      </div>
    )
  }

  const goals = activeProgram.goals

  const hasGoals =
    goals &&
    goals.currentWeight > 0 &&
    goals.currentBodyFat > 0 &&
    goals.achievementGoals.trim() !== '' &&
    goals.consistencyGoals.percentageComplete > 0 &&
    goals.consistencyGoals.daysPerWeek > 0

  // Determine the first phase and first daily routine
  const firstPhase = workoutProgram?.phases[0]
  const firstWorkoutId = firstPhase?.weeklyTemplate.days[0] || ''

  const firstWorkout = dailyRoutines.find(
    (routine) => routine.id === firstWorkoutId
  )

  return (
    <div className='min-h-screen flex flex-col items-center bg-background px-4 py-6'>
      <h1 className='text-3xl font-semibold mb-6'>Active Program</h1>

      {/* Goals and Measurements */}
      {!hasGoals ? (
        <div className='w-full max-w-md'>
          <p className='mb-4'>
            Please set your goals and measurements to start the program.
          </p>
          <button
            onClick={handleOpenSetGoalsModal}
            className='w-full px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
          >
            Start Program
          </button>
        </div>
      ) : (
        <div className='w-full max-w-md mb-6'>
          <h2 className='text-2xl font-semibold mb-2'>
            Your Goals and Measurements
          </h2>
          <div className='space-y-2'>
            <p>
              <strong>Current Weight:</strong> {goals.currentWeight} lb
            </p>
            <p>
              <strong>Current Body Fat:</strong> {goals.currentBodyFat}%
            </p>
            <h3 className='text-xl font-semibold mt-4'>
              Body Measurements (in)
            </h3>
            <ul className='list-disc list-inside'>
              {Object.entries(goals.bodyMeasurements).map(
                ([part, measurement]) => (
                  <li key={part} className='capitalize'>
                    {part}: {measurement} in
                  </li>
                )
              )}
            </ul>
            <p>
              <strong>Achievement Goals:</strong> {goals.achievementGoals}
            </p>
            <p>
              <strong>Consistency Goals:</strong>{' '}
              {goals.consistencyGoals.percentageComplete}% completion,{' '}
              {goals.consistencyGoals.daysPerWeek} days per week
            </p>
            {activeProgram.photoURL && (
              <div>
                <p>
                  <strong>Program Start Photo:</strong>
                </p>
                <Image
                  src={activeProgram.photoURL}
                  alt='Program Start'
                  className='mt-2 w-48 h-80 object-cover object-center rounded-md'
                  width={1260}
                  height={1080}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* First Workout */}
      {hasGoals && workoutProgram && firstPhase && firstWorkout && (
        <div className='w-full max-w-md mb-6 p-4 bg-background-secondary rounded-md shadow-md'>
          <h2 className='text-xl font-semibold mb-2'>First Workout</h2>
          <p>
            <strong>Phase:</strong> {firstPhase.name}
          </p>
          <p>
            <strong>Week:</strong>{' '}
            {firstPhase.weeks.length > 0 ? firstPhase.weeks[0] : 'N/A'}
          </p>
          <p>
            <strong>Day:</strong> Day 1
          </p>
          {/* Display daily routine if available */}
          <div className='mt-2'>
            <p>
              <strong>Daily Routine:</strong> {firstWorkout.name}
            </p>
            {/* Display sets and exercises */}
            {sets.length > 0 ? (
              sets.map((set) => (
                <div key={set.id} className='mt-2'>
                  <p className='font-semibold'>Set: {set.name}</p>
                  {set.exercises.length > 0 ? (
                    <ul className='list-disc list-inside ml-4'>
                      {set.exercises.map((exerciseId) => {
                        const exercise = exercises.find(
                          (ex) => ex.id === exerciseId
                        )
                        return exercise ? (
                          <li key={exercise.id}>{exercise.name}</li>
                        ) : (
                          <li key={exerciseId}>Unknown Exercise</li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className='ml-4'>No exercises found for this set.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No sets found for this routine.</p>
            )}
          </div>
          <button
            onClick={() => {
              // Implement navigation to workout page or start workout functionality
              console.log('Start Workout')
              // For example, navigate to '/client-portal/active-program/workout'
              router.push(
                `/client-portal/active-program/workout/${activeProgram.id}`
              )
            }}
            className='mt-4 w-full px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
          >
            Start Workout
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {hasGoals && (
        <div className='w-full max-w-md flex justify-between space-x-2'>
          <button
            onClick={handleOpenAbandonModal}
            className='w-1/2 px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500'
          >
            Abandon Program
          </button>
          <button
            onClick={handleOpenEndModal}
            className='w-1/2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500'
          >
            End Program
          </button>
        </div>
      )}

      {/* Set Goals Modal */}
      {workoutProgram && activeProgram && (
        <SetGoalsModal
          isOpen={isSetGoalsModalOpen}
          onClose={handleCloseSetGoalsModal}
          program={workoutProgram}
          activeProgramId={activeProgram.id}
        />
      )}

      {/* Abandon Confirmation Modal */}
      <ConfirmationModal
        isOpen={isAbandonModalOpen}
        onClose={handleCloseAbandonModal}
        onConfirm={handleConfirmAbandon}
        title='Abandon Program'
        message='Are you sure you want to abandon this program? You will lose all progress made, and this decision is irreversible.'
        confirmText='Abandon'
        cancelText='Cancel'
      />

      {/* End Program Confirmation Modal */}
      <ConfirmationModal
        isOpen={isEndModalOpen}
        onClose={handleCloseEndModal}
        onConfirm={handleConfirmEnd}
        title='End Program'
        message='This will end the program and move it to your archived programs. Do you want to proceed?'
        confirmText='End Program'
        cancelText='Cancel'
      />

      {/* Error Message */}
      {error && <div className='text-red-500 text-sm mt-4'>{error}</div>}
    </div>
  )
}

export default ActiveProgramPage
