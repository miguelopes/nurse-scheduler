#!/usr/bin/python2

import json

from z3_utils_hakank import *

set_option(timeout=60000)
#set_option(timeout=20000)

def make_from_json(json):
    return make(
        int(json["normals"]),
        int(json["onlyMornings"]),
        int(json["onlyMorningsNoWeekends"]),
        int(json["chiefs"]))

count_week_days = 7
def make(count_nurses = 20,
         count_nurses_only_m = 2,
         count_nurses_only_m_no_weekends = 2,
         count_chiefs = 5):
    s = Optimize()
    #s = Solver()

    # `people` x `week_days` matrix of integer variables
    Nurse_days = [ [ Int("Nurse_%s_%s" % (i+1, j+1))
                    for j in range(count_week_days) ]
                  for i in range(count_nurses) ]
    Nurse_only_m_days = [ [ Int("Nurse_only_m_%s_%s" % (i+1, j+1))
                           for j in range(count_week_days) ]
                         for i in range(count_nurses_only_m) ]
    Nurse_only_m_no_weekends_days = [ [ Int("Nurse_only_m_no_weekends_%s_%s" % (i+1, j+1))
                                       for j in range(count_week_days) ]
                                     for i in range(count_nurses_only_m_no_weekends) ]
    Chief_days = [ [ Int("Chief_%s_%s" % (i+1, j+1))
                    for j in range(count_week_days) ]
                  for i in range(count_chiefs) ]

    # Map shifts to integers:
    # - Unassigned shift = 0
    # - M = 1
    # - T = 2
    # - N = 3
    # each cell contains a value in {0, ..., 3}
    cells_nurse_c = [ And(0 <= Nurse_days[i][j], Nurse_days[i][j] <= 3)
                     for i in range(count_nurses)
                     for j in range(count_week_days) ]
    cells_nurse_only_m_c = [ And(0 <= Nurse_only_m_days[i][j], Nurse_only_m_days[i][j] <= 1)
                            for i in range(count_nurses_only_m)
                            for j in range(count_week_days) ]
    cells_nurse_only_m_no_weekends_c = [ (And(0 <= Nurse_only_m_no_weekends_days[i][j], Nurse_only_m_no_weekends_days[i][j] <= 1) if j < 5 else Nurse_only_m_no_weekends_days[i][j] == 0)
                                        for i in range(count_nurses_only_m_no_weekends)
                                        for j in range(count_week_days) ]
    cells_chief_c = [ And(0 <= Chief_days[i][j], Chief_days[i][j] <= 3)
                     for i in range(count_chiefs)
                     for j in range(count_week_days) ]

    def at_least(sol,c_name,v,x,min):
        c = Int(c_name)
        sol.add(c>=0, c <= len(x))
        count(sol,v,x,c)
        sol.add(c >= min)

    # each nurse contains at least `count` assignments, for each shift:
    # - M >= 6
    # - T >= 5
    # - N >= 5
    for i in range(count_week_days):
        at_least(s, "c_nurse_m_%s" % (i), 1,
                 [ column_cell[i] for column_cell in Nurse_days ] +
                 [ column_cell[i] for column_cell in Nurse_only_m_days ] +
                 [ column_cell[i] for column_cell in Nurse_only_m_no_weekends_days ], 6)
        at_least(s, "c_nurse_t_%s" % (i), 2, [ column_cell[i]
                                              for column_cell in Nurse_days ], 5)
        at_least(s, "c_nurse_n_%s" % (i), 3, [ column_cell[i]
                                              for column_cell in Nurse_days ], 5)

    # each nurse contains at least 2 free days:
    for i in range(count_nurses):
        at_least(s, "c_nurse_f_%s" % (i), 0, Nurse_days[i], 2)
    for i in range(count_nurses_only_m):
        at_least(s, "c_nurse_only_m_f_%s" % (i), 0, Nurse_only_m_days[i], 2)
    for i in range(count_nurses_only_m_no_weekends):
        at_least(s, "c_nurse_only_m_no_weekends_f_%s" % (i), 0, Nurse_only_m_no_weekends_days[i], 2)

    # each chief contains at least `count` assignments, for each shift:
    # - M >= 1
    # - T >= 1
    # - N >= 1
    for i in range(count_week_days):
        at_least(s, "c_chief_m_%s" % (i), 1, [ column_cell[i] for column_cell in Chief_days ], 1)
        at_least(s, "c_chief_t_%s" % (i), 2, [ column_cell[i] for column_cell in Chief_days ], 1)
        at_least(s, "c_chief_n_%s" % (i), 3, [ column_cell[i] for column_cell in Chief_days ], 1)

    # each chief contains at least 2 free days:
    for i in range(count_chiefs):
        at_least(s, "c_chief_f_%s" % (i), 0, Chief_days[i], 2)

    # each week for each nurse/chief must have shifts totalizing >= 35h (2100m).
    # shift weights:
    # - M =  7.5 (450)
    # - T =  8.0 (480)
    # - N = 10.0 (600)
    for i in range(count_nurses):
        sum_week = Sum([(If(Nurse_days[i][j] == 1, 450, 0) +
                         If(Nurse_days[i][j] == 2, 480, 0) +
                         If(Nurse_days[i][j] == 3, 600, 0))
                        for j in range(count_week_days)])
        s.add(sum_week >= 2100)
    for i in range(count_chiefs):
        sum_week = Sum([(If(Chief_days[i][j] == 1, 450, 0) +
                         If(Chief_days[i][j] == 2, 480, 0) +
                         If(Chief_days[i][j] == 3, 600, 0))
                        for j in range(count_week_days)])
        s.add(sum_week >= 2100)

    s.add(cells_nurse_c)
    s.add(cells_nurse_only_m_c)
    s.add(cells_nurse_only_m_no_weekends_c)
    s.add(cells_chief_c)

    def serialize_matrix(m):
        return list(map(lambda l: list(map(lambda c: int(c.__str__()), l)), m))

    results = {}
    if s.check() == sat:
        m = s.model()
        r = [ [ m.evaluate(Nurse_days[i][j])
               for j in range(count_week_days) ]
             for i in range(count_nurses) ]
        results["normals"] = serialize_matrix(r)
        r = [ [ m.evaluate(Nurse_only_m_days[i][j])
               for j in range(count_week_days) ]
             for i in range(count_nurses_only_m) ]
        results["onlyMornings"] = serialize_matrix(r)
        r = [ [ m.evaluate(Nurse_only_m_no_weekends_days[i][j])
               for j in range(count_week_days) ]
             for i in range(count_nurses_only_m_no_weekends) ]
        results["onlyMorningsNoWeekends"] = serialize_matrix(r)
        r = [ [ m.evaluate(Chief_days[i][j])
               for j in range(count_week_days) ]
             for i in range(count_chiefs) ]
        results["chiefs"] = serialize_matrix(r)
        return json.dumps(results)
    else:
        return json.dumps({"error":"failed to solve"})
