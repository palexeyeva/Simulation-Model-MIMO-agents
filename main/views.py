from django.http import request
from django.http import response
from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404, render
import requests
import random as ran
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import (MultipleLocator, FormatStrFormatter, AutoMinorLocator)
from matplotlib.collections import LineCollection
from matplotlib import colors as mcolors
import matplotlib.gridspec as gridspec
import io
from io import *
from matplotlib.backends.backend_agg import FigureCanvasAgg
import base64

import scipy.stats as ss


def index(request):

    n = 0
    R = []
    Th = []
    mem = []
    disc = []
    init = []
    st = []
    fig = plt.figure(figsize=(15, 15), constrained_layout = True)
    iter = 0
    prt = {}
    p = []
    if request.method == 'POST':
        n = int(request.POST['count'])    
        # for i in range(n):
        #     g = []
        #     for j in range(n):
        #         nm = f"m_{i+1}_{j+1}"
        #         m = float(request.POST[nm])                
        #         g.append(m)
        #     R.append(g)
        #Полный граф
        for i in range(n):
            g = []
            for j in range(n):
                if (i != j) :
                    g.append(1)
                else:
                    g.append(0)
            R.append(g)
        print(R)

        #порог
        center = 100
        std = 20
        x = np.arange(0, n)
        T = ss.norm.pdf(x,loc=center, scale = std )
        print(T)

        for i in range(n):
            Th.append(float(request.POST[f"th_{i}"]))
        for i in range(n):
            disc.append(float(request.POST[f"disc_{i}"]))
        for i in range(n):
            mem.append(int(request.POST[f"mem_{i}"]))
        for i in range(n):
            init.append(int(request.POST[f"init_{i}"]))
        for i in range(n):
            g = []
            p1 = float(request.POST[f"st_{i+1}_1"])
            g = [p1, 1 - p1]
            st.append(g)
        iter = int(request.POST['iter'])
    
        net = {
            'count': n,
            'matrix' : R,
            'Th': Th,
            'init': init,
            'mem': mem,
            'disc': disc,
            'st': st
        }

        prt = {
            't': [0],
            'iner': [],
            'state': [init]
        }

        n = int(n)
        initial = net['init']
        memory = net['mem']
        p = net['st']
        discount = net['disc']
        

        plotState = list()
        inerState = list()
        for i in range(n):
            inerState.append([[0, 0]])
        plotState.append(net['init'])
        fl = 1
        t = 1
        state = initial.copy()
        curMem1 = list()
        curMem2 = list()
        for i in range(n):
            b = np.ones((memory[i], 2)) 
            c = np.ones((memory[i], 2)) 
            curMem1.append(b)
            curMem2.append(c)
        for i in range(n):
            for j in range(memory[i]): 
                for k in range(int(2)):
                    curMem1[i][j][k] = curMem1[i][j][k]*0
                    curMem2[i][j][k] = curMem2[i][j][k]*0
        print('Состояние сети для t = 0:', initial)
        while fl == 1:
            step = 0
            while step < iter:
                e = [0, 0]
                sum1 = 0
                sum2 = 0
                for j in range(n):
                    flag = 0
                    for i in range(n):
                        if initial[i] == 1:
                            e[0] = e[0] + p[j][0] * R[i][j] 
                        elif initial[i] == 2:
                            e[1] = e[1] + p[j][1] * R[i][j]
                        s = e[0] + e[1] #new
                    for i in range(memory[j]):
                        curMem1[j][i][0] = curMem1[j][i][1]
                        curMem2[j][i][0] = curMem2[j][i][1]
                    curMem1[j][0][1] = curMem1[j][0][1] * 0
                    curMem2[j][0][1] = curMem2[j][0][1] * 0
                    curMem1[j][0][1] += e[0]
                    curMem2[j][0][1] += e[1]
                    for i in range(memory[j]): 
                        if i + 2 <= memory[j] and memory[j] != 1:
                            curMem1[j][i + 1][1] = curMem1[j][i][0] * discount[j]
                            curMem2[j][i + 1][1] = curMem2[j][i][0] * discount[j]
                    if memory[j] == 1:
                        sum1 = e[0]
                        sum2 = e[1]
                    else: 
                        for i in range(memory[j]):
                            sum1 += curMem1[j][i][1]
                            sum2 += curMem2[j][i][1]
                    if sum1+sum2 >= Th[j] and sum1 > sum2:
                        state[j] = 1
                        flag = 1
                    elif sum1+sum2 >=Th[j] and sum2 > sum1:
                        state[j] = 2
                        flag = 1
                    elif sum1+sum2 >= Th[j] and sum1 == sum2:
                        if p[j][0] > p[j][1]:
                            state[j] = 1
                            flag = 1
                        elif p[j][0] < p[j][1]:
                            state[j] = 2
                            flag = 1
                        elif p[j][0] == p[j][1]:
                            state[j] = ran.randint(1, 2)
                    elif (e[0] == e[1] and e[0] == 0) or (e[0]+e[1] < Th[j]):
                        state[j] = 0
                    print('Внутреннее состояние агента', j, ': (', sum1, ', ', sum2, ')')
                    inerState[j].append([sum1, sum2])
                    e = [0, 0]
                    sum1 = 0
                    sum2 = 0
                    if flag == 1:
                        for i in range(memory[j]):
                            for k in range(int(2)):
                                curMem1[j][i][k] = curMem1[j][i][k] * 0
                                curMem2[j][i][k] = curMem2[j][i][k] * 0
                initial = state.copy()
                plotState.append(initial)
                print('-------Внешнее состояние сети для t =', t,':', initial, '-------')

                prt['t'].append(t)
                prt['state'].append(initial)

                t += 1
                step += 1
            init_new = {}
            g = []
            for i in range(n):
                for j in range(t):
                    g.append(plotState[j][i])
                init_new[str(i)] = g.copy()
                g = []
            timePeriod = [f"t{i}" for i in range(t)]
            activeType = ["0", " ", " "]
            nr = int(3 * n)
            gs = gridspec.GridSpec(ncols = 2, nrows = nr , figure=fig)
            tx = {}
            xtick = [i for i in range(t)]
            ytick = [0, 1, 2]
        
            # cls = 'Агент №' + str(i)
            width = 0.3
            x = np.arange(t)
            ax = {}
            for i in range(n):
                h1 = list()
                h2 = list()
                for k in range(t):
                    if init_new[str(i)][k] == 0:
                        h1.append(int(0))
                        h2.append(int(0))
                    elif init_new[str(i)][k] == 1:
                        h1.append(int(1))
                        h2.append(int(0))
                    elif init_new[str(i)][k] == 2:
                        h1.append(int(0))
                        h2.append(int(1))
                tx[str(i)] = fig.add_subplot(gs[i, :])
                tx[str(i)].set_xticks(xtick)
                tx[str(i)].set_yticks(ytick)
                tx[str(i)].set_yticklabels(activeType)
                tx[str(i)].bar(x, h1, width, label='Активности типа 1')
                tx[str(i)].bar(x, h2, width, label='Активность типа 2') 
                tx[str(i)].legend(bbox_to_anchor=(1, 0.6))
                tx[str(i)].set_xticklabels(timePeriod)
                tx[str(i)].set_title('Внешнее состояние агента №' + str(i+1))
        
            for i in range(n):
                g1 = list()
                g2 = list()
                T = list()
                count = 0
                for k in range(t):
                    g1.append(inerState[i][k][0])
                    g2.append(inerState[i][k][1])
                    T.append(Th[i])
                if i % 2 == 0:
                    ax[str(i)] = fig.add_subplot(gs[n + i - count:n + i - count + 2  , 0])
                else: 
                    count = count + 2
                    ax[str(i)] = fig.add_subplot(gs[n + i - count + 1:n + i - count + 3 , 1])
                ax[str(i)].plot(g1, lw = 2, label = 'Активности типа 1', marker = 'o')
                ax[str(i)].plot(g2, lw = 2, label = 'Активность типа 2', marker = 'o')
                line = ax[str(i)].plot(x, T, linestyle = '--', color = 'grey', lw = 0.7)
                ax[str(i)].set_title('Внутреннее состояние агента №'+ str(i+1))
                ax[str(i)].set_xticks(x)
                ax[str(i)].set_xticklabels(timePeriod)
                ax[str(i)].legend()

            iSt = []
            for k in range(int(t)):
                j = []
                for i in range(int(n)):
                    g = inerState[i][k].copy()
                    j.append(g)
                iSt.append(j)


            prt['iner'].extend(iSt)
            p = zip(prt['t'], prt['state'], prt['iner'])
            
            fl = int(0)


    imgdata = BytesIO()
    fig.savefig(imgdata, format='png', bbox_inches='tight')
    imgdata.seek(0)

    encoded = base64.b64encode(imgdata.getvalue())
    data = '<img id="graph" src="data:image/png;base64, {}">'.format(encoded.decode('utf-8'))


    context = {
        'data': data,
        'prt': p
    }  

    return render(request, 'index.html', context)
