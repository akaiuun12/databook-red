---
title: Advanced Optimizers
description: 경사하강법보다 훈련 속도를 높일 수 있는 고급 옵티마이저. Momentum, SGD, Adam의 원리와 비교.
image: 
date: 2025-09-14
author: Akai Red
category: DL
tags: ['deep learning']
published: false
---

## GD (Gradient Descent)

## Momentum
```python
tf.keras.optimizers.SGD(learning_rate=0.001, momentum=0.9)
```
### NAG (Nesterov Accelerated Gradient)
```python
tf.keras.optimizers.SGD(learning_rate=0.001, momentum=0.9,
                        use_nestrov=True)
```

## Learning Rate
### AdaGrad
```python
tf.keras.optimizers.Adagrad(learning_rate=0.001)
```
### RMSProp
```python
tf.keras.optimizers.RMSprop(learning_rate=0.001, rho=0.9)
```

## Adam
```python
tf.keras.optimizers.Adam(learning_rate=0.001, beta_1=0.9,
                         beta_2=0.999)
```

### AdaMax, Nadam, AdamW


## Learning Rate Scheduling
```python
tf.keras.optimizers.SGD(learning_rate=0.01,
                        weight_decary=1e-4)
```
